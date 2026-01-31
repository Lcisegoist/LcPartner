export interface Conversation {
  title: string;
  conversation: Prompt[];
}

export interface Prompt {
  id: string;
  prompt: string;
  response: string;
}
export interface StoreProps {
  input: string;
  tempInput: string;
  inchat: boolean;
  recentPrompt: Prompt[];
  prevPrompt: Conversation[];
  showResult: boolean;
  loading: boolean;
  resultData: string | { id: string; content: string };
  voiceSearch: boolean;
  recognition: any;
  recordingAnimation: boolean;
  colorTheme: string;
  setInput: (text: string) => void;
  newChat: () => void;
  onSent: (prompt?: string) => Promise<void>;
  setRecentPrompt: (messages: { id: string; prompt: string; response: string }[]) => void;
  setPrevprompt: (conversations: Conversation[]) => void;
  setShowResult: (text: boolean) => void;
  setLoading: (text: boolean) => void;
  setResultData: (text: string | { id: string; content: string }) => void;
  setVoiceSearch: (text: boolean) => void;
  setRecognition: (text: any) => void;
  setRecordingAnimation: (text: boolean) => void;
  initVoiceRecognition: () => void;
  openVoiceSearch: () => void;
  setColorTheme: (theme: string) => void;
  handleKeyPress: (e: KeyboardEvent) => void;
}