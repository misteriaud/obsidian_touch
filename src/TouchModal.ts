import { SuggestModal, Notice, TFolder, Vault } from 'obsidian';

const EMPTY_STATE_TEXT = "Nothing found";
const PLACEHOLDER_TEXT = "Insert path";

export default class TouchModal extends SuggestModal<string> {
	inputListener: EventListener;
	current: TFolder = this.app.vault.getRoot();
	folders: string[] = [];

	constructor() {
		super(app);
		this.emptyStateText = EMPTY_STATE_TEXT;
		this.setPlaceholder(PLACEHOLDER_TEXT);
		Vault.recurseChildren(this.current, (afile) => {
			if (afile instanceof TFolder && afile != this.current)
				this.folders.push(afile.path + "/");
			// if (this.folders)
				// this.folders.push((afile.path);
		});
		this.inputListener = this.listenInput.bind(this);
	}
	onOpen() {
		super.onOpen();
		this.inputEl.addEventListener('keydown', this.inputListener);
	}
	onClose() {
		this.inputEl.removeEventListener('keydown', this.inputListener);
		super.onClose();
	}

	renderSuggestion(path: string, el: HTMLElement) {
		el.createEl("div", { text: path });
	}

	findCurrentSelect(): HTMLElement | null {
		return document.querySelector('.suggestion-item.is-selected');
	}

	listenInput(evt: KeyboardEvent) {
		if (evt.key == 'Tab') {
			console.log("tab");
			this.inputEl.value = this.findCurrentSelect()?.innerText;
			// to disable tab selections on input
			evt.preventDefault();
		}
	}

	// Returns all available suggestions.
	getSuggestions(query: string): string[] {
		const subselect: string[] = this.folders.filter(folder =>
			folder.includes(query)
		);
		if (subselect.length > 0)
			return subselect;
		return ([query]);
		// return (this.folders.map(folder => { return folder += "/" + query;}));
	}

	// Perform action on the selected suggestion.
	async onChooseSuggestion(path: string, evt: MouseEvent | KeyboardEvent) {
		// if create dir
		if (!path || this.app.vault.getAbstractFileByPath(path))
			return ;
		if (path.charAt(path.length - 1) == "/") {
			await this.app.vault.createFolder(path);
			new Notice(`Dir ${path} was created`);
		}
		else {
			const File = await this.app.vault.create(path + ".md", "");
			try {
				await this.app.workspace.activeLeaf.openFile(File);
			}
			catch {

			}
			// this.app.workspace
		}
	}

	// selectSuggestion(value: string, evt: MouseEvent | KeyboardEvent): void {
	// 	console.log(value);
	// }

}
