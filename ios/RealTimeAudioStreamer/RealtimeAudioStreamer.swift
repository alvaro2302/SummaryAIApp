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
          try session.setCategory(.record)
          try session.setMode(.default)
          try session.setPreferredSampleRate(16000)
          try session.setActive(true)

          audioEngine = AVAudioEngine()
          guard let engine = audioEngine else { return }

          let input = engine.inputNode
          let hwFormat = input.inputFormat(forBus: 0)

          // Formato deseado: 16kHz mono PCM Float32
          let desiredFormat = AVAudioFormat(
              commonFormat: .pcmFormatFloat32,
              sampleRate: 16000,
              channels: 1,
              interleaved: false
          )!

          // Conversión del micrófono al formato deseado
          let converter = AVAudioConverter(from: hwFormat, to: desiredFormat)!

          input.installTap(onBus: 0, bufferSize: 1024, format: hwFormat) { [weak self] (buffer, time) in
              guard let self = self else { return }

              let converted = AVAudioPCMBuffer(
                  pcmFormat: desiredFormat,
                  frameCapacity: AVAudioFrameCount(desiredFormat.sampleRate / 10)
              )!

              var error: NSError?
              let inputBlock: AVAudioConverterInputBlock = { _, outStatus in
                  outStatus.pointee = .haveData
                  return buffer
              }

              converter.convert(to: converted, error: &error, withInputFrom: inputBlock)

              if let err = error {
                  self.sendError("Converter error: \(err.localizedDescription)")
                  return
              }

              self.sendPCMFloatBuffer(converted)
          }

          try engine.start()

      } catch {
          sendError("Audio start error: \(error.localizedDescription)")
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
  private func sendPCMFloatBuffer(_ buffer: AVAudioPCMBuffer) {
      guard let floatChannelData = buffer.floatChannelData else { return }
      let frames = Int(buffer.frameLength)

      var out = Data(capacity: frames * 2)
      let channel = floatChannelData[0]

      for i in 0..<frames {
          let float = max(-1, min(1, channel[i]))
          var int16 = Int16(float * Float(Int16.max)).littleEndian
          withUnsafeBytes(of: &int16) { out.append(contentsOf: $0) }
      }

      let base64 = out.base64EncodedString()
      sendEvent(withName: "audioChunk", body: ["data": base64])
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
