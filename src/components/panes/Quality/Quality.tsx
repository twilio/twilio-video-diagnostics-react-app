import { ExcellentQuality } from './ExcellentQuality/ExcellentQuality';
import { PoorQuality } from './PoorQuality/PoorQuality';
import { getQualityScore } from './getQualityScore/getQualityScore';
import { useAppStateContext } from '../../AppStateProvider/AppStateProvider';
import { QualityModal } from './QualityModal/QualityModal';
import { useState } from 'react';

export enum QualityScore {
  Good,
  Bad,
  Average,
  Excellent,
}

export function Quality() {
  const { state } = useAppStateContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { totalQualityScore, latency, jitter, packetLoss, bitrate } = getQualityScore(
    state.preflightTest.report!,
    state.bitrateTest.report!
  );

  return (
    <>
      <QualityModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        jitter={jitter}
        latency={latency}
        packetLoss={packetLoss}
        bitrate={bitrate}
      />
      {totalQualityScore === QualityScore.Good || totalQualityScore === QualityScore.Excellent ? (
        <ExcellentQuality quality={totalQualityScore} openModal={() => setIsModalOpen(true)} />
      ) : (
        <PoorQuality quality={totalQualityScore} openModal={() => setIsModalOpen(true)} />
      )}
    </>
  );
}
