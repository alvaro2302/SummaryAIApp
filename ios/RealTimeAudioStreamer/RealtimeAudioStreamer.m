//
//  RealtimeAudioStreamer.m
//  SummaryAIApp
//
//  Created by Alvaro Cuiza on 19/11/25.
//
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(RealtimeAudioStreamer, RCTEventEmitter)
  RCT_EXTERN_METHOD(startRecording)
  RCT_EXTERN_METHOD(stopRecording)
@end
