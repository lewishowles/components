type FlashMessageType = "error" | "info" | "muted" | "success" | "warning";

interface FlashMessage {
	live?: boolean;
	message?: string;
	namespace?: string;
	showIcon?: boolean;
	title?: string;
	titleTag?: string;
	type?: FlashMessageType;
}

interface StoredFlashMessage extends FlashMessage {
	id: string;
}

export declare function useFlashMessages(): {
	_clearMessages(): void;
	clearMessages(namespace?: string): void;
	getMessages(namespace?: string): StoredFlashMessage[];
	sendMessage(message: FlashMessage): void;
};
