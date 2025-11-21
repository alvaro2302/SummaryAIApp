import React, {useState, useEffect} from 'react';
// IMPORTANTE: Descomentar la siguiente línea en tu proyecto React Native real
import {Text, StyleSheet, View, Platform} from 'react-native';
interface RecordingTimerProps {
  /** Indica si la grabación está pausada */
  isPause: boolean;
  /** Indica si la grabación está detenida (resetea el contador) */
  isStop: boolean;
  /** Callback que se ejecuta cuando el contador llega a 1 hora */
  isStart: boolean;
  StopRecording: () => void;
}

export const RecordingTimer: React.FC<RecordingTimerProps> = ({
  isPause,
  isStop,
  StopRecording,
  isStart,
}) => {
  const [seconds, setSeconds] = useState(0);
  const MAX_TIME_SECONDS = 3600; // 1 Hora

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // Si está detenido, reseteamos el contador y limpiamos intervalo
    if (isStop) {
      setSeconds(0);
      if (interval) clearInterval(interval);
      return;
    }
    if (isPause) {
      if (interval) clearInterval(interval);
      return;
    }
    // Lógica principal del contador
    if (!isPause && !isStop && isStart) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          // Verificar si llegamos al límite de 1 hora
          if (prevSeconds + 1 >= MAX_TIME_SECONDS) {
            if (interval) clearInterval(interval);
            StopRecording(); // Llamar al método void
            return MAX_TIME_SECONDS;
          }
          return prevSeconds + 1;
        });
      }, 1000);
    }

    // Limpieza al desmontar o cambiar dependencias
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPause, isStop, StopRecording, isStart]);

  /**
   * Formatea los segundos en formato MM:SS o HH:MM:SS si es necesario.
   * Basado en la imagen, priorizamos MM:SS, pero mostramos 60:00 al final.
   */
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    // Asegura que siempre tenga 2 dígitos (ej. 01:05)
    const displayMinutes = String(minutes).padStart(2, '0');
    const displaySeconds = String(remainingSeconds).padStart(2, '0');

    return `${displayMinutes}:${displaySeconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(seconds)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  timerText: {
    fontSize: 64, // Tamaño grande como en la imagen
    fontWeight: '700', // Bold
    color: '#1F2937', // Color oscuro (Slate/Gray dark) similar a la imagen
    fontVariant: ['tabular-nums'], // Evita que el texto "baile" al cambiar los números
    includeFontPadding: false,
    ...Platform.select({
      ios: {
        fontFamily: 'System', // San Francisco en iOS se ve similar
      },
      android: {
        fontFamily: 'Roboto', // Roboto en Android
      },
    }),
  },
});

export default RecordingTimer;
