export interface StoreProps {
  input: string;
  recentPrompt: string;
  prevPrompt: string[];
  showResult: boolean;
  loading: boolean;
  resultData: string;
  voiceSearch: boolean;
  recognition: any;
  recordingAnimation: boolean;
  setInput: (text: string) => void;
  newChat: () => void;
  onSent: (prompt?: string) => Promise<void>;
  setRecentPrompt: (text: string) => void;
  setPrevprompt: (text: string[]) => void;
  setShowResult: (text: boolean) => void;
  setLoading: (text: boolean) => void;
  setResultData: (text: string) => void;
  setVoiceSearch: (text: boolean) => void;
  setRecognition: (text: any) => void;
  setRecordingAnimation: (text: boolean) => void;
  initVoiceRecognition: () => void;
  openVoiceSearch: () => void;
  handleKeyPress: (e: KeyboardEvent) => void;
}