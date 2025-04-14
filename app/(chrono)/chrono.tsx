"use client"

import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function Chronometer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [preset, setPreset] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => {
          // If there's a preset and we've reached it, stop the timer
          if (preset && prevTime >= preset) {
            setIsRunning(false);
            return preset;
          }
          return prevTime + 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, preset]);

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  const handlePreset = (seconds: number) => {
    setPreset(seconds);
    setTime(0);
    setIsRunning(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chronometer</Text>
      
      <View style={styles.timerCard}>
        <View style={styles.timerHeader}>
          <Text style={styles.timerTitle}>Rest Timer</Text>
        </View>
        <View style={styles.timerContent}>
          <Text style={styles.timeDisplay}>{formatTime(time)}</Text>
          
          <View style={styles.buttonsRow}>
            {isRunning ? (
              <TouchableOpacity 
                style={styles.pauseButton}
                onPress={handlePause}
              >
                <Text style={styles.buttonText}>Pause</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.startButton}
                onPress={handleStart}
              >
                <Text style={styles.buttonText}>Start</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <View style={styles.presetCard}>
        <View style={styles.presetHeader}>
          <Text style={styles.presetTitle}>Preset Timers</Text>
        </View>
        <View style={styles.presetGrid}>
          <TouchableOpacity 
            style={styles.presetButton}
            onPress={() => handlePreset(30)}
          >
            <Text style={styles.presetButtonText}>30s</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.presetButton}
            onPress={() => handlePreset(60)}
          >
            <Text style={styles.presetButtonText}>1min</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.presetButton}
            onPress={() => handlePreset(90)}
          >
            <Text style={styles.presetButtonText}>1min 30s</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.presetButton}
            onPress={() => handlePreset(120)}
          >
            <Text style={styles.presetButtonText}>2min</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.presetButton}
            onPress={() => handlePreset(180)}
          >
            <Text style={styles.presetButtonText}>3min</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.presetButton}
            onPress={() => handlePreset(300)}
          >
            <Text style={styles.presetButtonText}>5min</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  timerCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timerHeader: {
    padding: 16,
    backgroundColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  timerTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  timerContent: {
    padding: 24,
    alignItems: 'center',
  },
  timeDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  startButton: {
    backgroundColor: '#4C7DFF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  pauseButton: {
    backgroundColor: '#999',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  resetButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  presetCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  presetHeader: {
    padding: 16,
    backgroundColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  presetTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  presetButton: {
    backgroundColor: '#4C7DFF',
    width: '48%',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  presetButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});