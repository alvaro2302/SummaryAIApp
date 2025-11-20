//
//  RealtimeAudioStreamer.swift
//  SummaryAIApp
//
//  Created by Alvaro Cuiza on 19/11/25.
//
import Foundation
import AVFoundation
import React
@objc(RealtimeAudioStreamer)
class RealtimeAudioStreamer: RCTEventEmitter {
  private var audioEngine: AVAudioEngine?
  private var converterNode: AVAudioMixerNode?
  private var isRecording = false

  override static func requiresMainQueueSetup() -> Bool { return true }

  override func supportedEvents() -> [String]! {
    return ["audioChunk", "recorderError"]
  }
  @objc func startRecording() {
    guard !isRecording else { return }
    isRecording = true

    let session = AVAudioSession.sharedInstance()
    do {
    // Configurar AVAudioSession
    try session.setCategory(.playAndRecord, options: [.defaultToSpeaker, .allowBluetooth])
    try session.setMode(.measurement)
    try session.setActive(true, options: .notifyOthersOnDeactivation)

    audioEngine = AVAudioEngine()
    guard let engine = audioEngine else { return }
    let inputNode = engine.inputNode

    // Formato de hardware (entrada real)
    let hwFormat = inputNode.inputFormat(forBus: 0)

    // Crear formato deseado: Float32 @ 16kHz mono
    let desiredSampleRate: Double = 16000
    let desiredChannels: AVAudioChannelCount = 1
    guard let desiredFormat = AVAudioFormat(commonFormat: .pcmFormatFloat32,
    sampleRate: desiredSampleRate,
    channels: desiredChannels,
    interleaved: false) else {
      sendError("Failed to create desired AVAudioFormat")
      return
    }

    // Nodo mezclador/conversor
    converterNode = AVAudioMixerNode()
    engine.attach(converterNode!)

    // Conectar: input -> converter -> mainMixer
    engine.connect(inputNode, to: converterNode!, format: hwFormat)
    engine.connect(converterNode!, to: engine.mainMixerNode, format: desiredFormat)

    // Tap en converter para obtener float32 a 16kHz
    converterNode!.installTap(onBus: 0, bufferSize: 1024, format: desiredFormat) { [weak self] (buffer, when) in
    self?.handleAudioBuffer(buffer: buffer)
    }

    try engine.start()

    } catch let err {
      sendError("Audio start error: \(err.localizedDescription)")
      isRecording = false
    }
  }
  @objc func stopRecording() {
    guard isRecording else { return }
    isRecording = false
    converterNode?.removeTap(onBus: 0)
    audioEngine?.stop()
    audioEngine = nil
  }
  private func handleAudioBuffer(buffer: AVAudioPCMBuffer) {
    guard let floatChannelData = buffer.floatChannelData else { return }
    let frameLength = Int(buffer.frameLength)

    // Convert float32 -> int16 LE
    var outData = Data(capacity: frameLength * MemoryLayout<Int16>.size)

    let channelData = floatChannelData[0]
    for i in 0..<frameLength {
      var sample = channelData[i]
      if sample > 1.0 { sample = 1.0 }
      if sample < -1.0 { sample = -1.0 }
      let int16 = Int16(sample * Float(Int16.max))
      var little = int16.littleEndian
      withUnsafeBytes(of: &little) { outData.append(contentsOf: $0) }
    }

    // Emitir base64 a JS (opción simple y compatible con RN)
    let b64 = outData.base64EncodedString()
    sendEvent(withName: "audioChunk", body: ["data": b64])
  }
  private func sendError(_ msg: String) {
    sendEvent(withName: "recorderError", body: ["error": msg])
  }
}
