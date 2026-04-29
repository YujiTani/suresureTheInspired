import kiSrc from '../../assets/icons/Aicon_ki.png';
import phantomSrc from '../../assets/icons/Aicon_Phantom.png';
import weakSrc from '../../assets/icons/Aicon_Weak.png';
import vulnerableSrc from '../../assets/icons/Aicon_Vulnerable.png';
import bonusEnergySrc from '../../assets/icons/Aicon_BonusEnergy.png';
import bonusDrawSrc from '../../assets/icons/Aicon_DrawCard.png';

interface IconProps {
  size?: number;
}

const baseStyle = { display: 'block', objectFit: 'contain' as const };

export function KiIcon({ size = 16 }: IconProps) {
  return <img src={kiSrc} width={size} height={size} alt="気" style={baseStyle} />;
}

export function PhantomIcon({ size = 16 }: IconProps) {
  return <img src={phantomSrc} width={size} height={size} alt="分身" style={baseStyle} />;
}

export function WeakIcon({ size = 16 }: IconProps) {
  return <img src={weakSrc} width={size} height={size} alt="弱体" style={baseStyle} />;
}

export function VulnerableIcon({ size = 16 }: IconProps) {
  return <img src={vulnerableSrc} width={size} height={size} alt="脆弱" style={baseStyle} />;
}

export function BonusEnergyIcon({ size = 16 }: IconProps) {
  return <img src={bonusEnergySrc} width={size} height={size} alt="追加エネルギー" style={baseStyle} />;
}

export function BonusDrawIcon({ size = 16 }: IconProps) {
  return <img src={bonusDrawSrc} width={size} height={size} alt="追加ドロー" style={baseStyle} />;
}
