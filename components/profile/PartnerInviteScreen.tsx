import React from 'react';
import { Modal } from 'react-native';
import JedaProFlow from '../pro/JedaProFlow';

export interface PartnerInviteProps {
  visible: boolean;
  onClose: () => void;
}

export default function PartnerInviteScreen({ visible, onClose }: PartnerInviteProps) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <JedaProFlow initialStep="invite" onClose={onClose} />
    </Modal>
  );
}
