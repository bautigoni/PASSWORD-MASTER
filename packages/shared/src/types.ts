export type Environment = 'city' | 'school' | 'bank' | 'hospital' | 'datacenter';

export type TowerKind =
  | 'basic_password'
  | 'strong_password'
  | 'mfa'
  | 'password_manager'
  | 'phishing_detector'
  | 'firewall'
  | 'soc_center';

export type EnemyKind =
  | 'script_kiddie'
  | 'botnet'
  | 'brute_force'
  | 'phisher'
  | 'breach_ghost'
  | 'deepfake'
  | 'ransomware_knight'
  | 'zero_day_phantom'
  | 'boss_weak_passwords'
  | 'boss_lord_reuse'
  | 'boss_breach_master'
  | 'boss_phisher_king';

export type PetKind = 'byte' | 'firewall_dog' | 'cyber_owl' | 'password_panda' | 'hack_hunter';

export type AchievementKind =
  | 'guardian_novato'
  | 'firewall_legend'
  | 'password_master'
  | 'mfa_defender'
  | 'cyber_champion'
  | 'first_blood'
  | 'no_damage'
  | 'speedrunner'
  | 'completionist'
  | 'phisher_hunter';

export type DamageType = 'physical' | 'magic' | 'true';

export interface Vec2 {
  x: number;
  y: number;
}

export interface TowerStat {
  damage: number;
  range: number;
  fireRate: number; // shots per second
  splash?: number;
  cost: number;
  hp: number;
  description: string;
  educational: string;
}

export interface EnemyStat {
  hp: number;
  speed: number; // tiles per second
  armor: number;
  bounty: number; // coins
  damage: number; // damage to city core
  description: string;
  educational: string;
  isBoss?: boolean;
  isHidden?: boolean; // requires SOC reveal
}

export interface LevelManifest {
  id: string;
  name: string;
  environment: Environment;
  difficulty: 1 | 2 | 3 | 4 | 5;
  startingCoins: number;
  startingLives: number;
  waves: WaveManifest[];
  unlockedBy?: string;
  isProcedural?: boolean;
}

export interface WaveManifest {
  delay: number; // seconds before the wave starts
  groups: EnemyGroup[];
  boss?: EnemyGroup;
}

export interface EnemyGroup {
  kind: EnemyKind;
  count: number;
  interval: number; // seconds between spawns
  delay?: number;
}

export interface Achievement {
  id: AchievementKind;
  name: string;
  description: string;
  reward: { coins?: number; gems?: number; xp?: number };
  icon: string;
}

export interface Pet {
  id: PetKind;
  name: string;
  description: string;
  passive: PetPassive;
  icon: string;
}

export interface PetPassive {
  kind: 'xp_boost' | 'coin_boost' | 'damage_boost' | 'reveal_radius' | 'fire_rate_boost';
  value: number;
}

export interface PublicUser {
  id: string;
  username: string;
  avatar?: string;
  level: number;
  xp: number;
  coins: number;
  gems: number;
  equippedPet?: PetKind;
  role: 'student' | 'teacher' | 'admin';
}
