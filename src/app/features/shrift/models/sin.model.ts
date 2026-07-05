export interface Sin {
  uid: string;
  text: string;
  severity: Severity;
  status: Status;
}

export type Severity = 'critical' | 'medium' | 'low';
export type Status = 'none' | 'half' | 'full';
