export interface AnalysisResult {
  id: string;
  url: string;
  timestamp: string;
  verdict: 'Threat' | 'Safe' | 'Warning' | 'Scanning';
  confidence: number;
  composition: {
    lexical: number;
    html: number;
    visual: number;
  };
  lexicalInfo: {
    length: number;
    entropy: number;
    tld: string;
    brandSpoof: string;
    registrar: string;
    creationDate: string;
    registrantOrg: string;
    nameserver: string;
    ageDays: number;
  };
  htmlInfo: {
    formAction: { status: 'Critical' | 'High' | 'Medium' | 'Low' | 'Safe'; details: string };
    obfuscatedJs: { status: 'Critical' | 'High' | 'Medium' | 'Low' | 'Safe'; details: string };
    zeroWidth: { status: 'Critical' | 'High' | 'Medium' | 'Low' | 'Safe'; details: string };
    tfidfKeywords: { word: string; score: number }[];
  };
  visualInfo: {
    logoRecognition: string;
    layoutSimilarity: string;
    cnnDecision: string;
    imageUrl: string;
  };
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  sourceIP: string;
  details: string;
}

export interface ApiKey {
  id: string;
  name: string;
  token: string;
  created: string;
  lastUsed: string;
}

export interface AlertConfig {
  cpuCrit: number;
  cpuWarn: number;
  memCrit: number;
  diskWarn: number;
  diskCrit: number;
  apiErrorRate: number;
  inferenceLatencyMax: number;
  confidenceDrop: number;
  emailAlertsEnabled: boolean;
  emailAddress: string;
  slackWebhook: string;
  slackConnected: boolean;
  pagerDutyEnabled: boolean;
  pagerDutyKey: string;
  customWebhookEnabled: boolean;
  customWebhookUrl: string;
  alertGrouping: string;
  maintenanceMode: boolean;
}
