import React from 'react';
import { Modal } from 'react-native';
import JedaProFlow from '../pro/JedaProFlow';

export interface JedaProScreenProps {
  visible: boolean;
  onClose: () => void;
}

export default function JedaProScreen({ visible, onClose }: JedaProScreenProps) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <JedaProFlow onClose={onClose} />
    </Modal>
  );
}
