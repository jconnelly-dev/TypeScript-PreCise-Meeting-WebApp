import { Logger } from './logger.js';

export class ParticipantList {
    private static isEditModeEnabled: boolean = false;
    private static activeEditInput: HTMLInputElement | null = null;
    private static activeEditButton: HTMLButtonElement | null = null;
    private static suppressedEditButton: HTMLButtonElement | null = null;
    private static draggedItem: HTMLLIElement | null = null;
    private static lockedBoardWidth: string | null = null;
    private static readonly editModeEnabledLabel: string = 'Edit';
    private static readonly editModeDisabledLabel: string = 'Edit';

    public static initializeEditModeToggle(buttonElement: HTMLButtonElement): void {
        Logger.log(Logger.LogLevel.TRACE, ParticipantList, ParticipantList.initializeEditModeToggle);

        const buttonLabelElement: HTMLSpanElement | null = buttonElement.querySelector('.share-info');
        buttonElement.setAttribute('aria-pressed', 'false');
        document.body.classList.remove('edit-mode-enabled');
        ParticipantList.updateEditModeToggleLabel(buttonLabelElement, false);

        buttonElement.addEventListener('click', () => {
            ParticipantList.isEditModeEnabled = !ParticipantList.isEditModeEnabled;

            if (!ParticipantList.isEditModeEnabled) {
                ParticipantList.finishActiveEdit();
            }

            buttonElement.classList.toggle('is-active', ParticipantList.isEditModeEnabled);
            buttonElement.setAttribute('aria-pressed', `${ParticipantList.isEditModeEnabled}`);
            document.body.classList.toggle('edit-mode-enabled', ParticipantList.isEditModeEnabled);
            ParticipantList.updateEditModeToggleLabel(buttonLabelElement, ParticipantList.isEditModeEnabled);
            ParticipantList.updateParticipantEditModeState();
            ParticipantList.refreshAllParticipantNumbers();
        });
    }

    public static toggleParticipantSelection(itemElement: HTMLLIElement): void {
        Logger.log(Logger.LogLevel.TRACE, ParticipantList, ParticipantList.toggleParticipantSelection);

        const isSelected: boolean = itemElement.classList.toggle('is-selected');
        itemElement.setAttribute('aria-pressed', `${isSelected}`);

        if (ParticipantList.isEditModeEnabled) {
            itemElement.classList.toggle('is-excluded', isSelected);
        } else if (!isSelected) {
            itemElement.classList.remove('is-excluded');
        }

        const listElement: HTMLUListElement | null = itemElement.parentElement as HTMLUListElement | null;
        if (listElement) {
            ParticipantList.refreshParticipantNumbers(listElement);
        }
    }

    public static createParticipantListItem(name: string, index: number): HTMLLIElement {
        const itemElement: HTMLLIElement = document.createElement('li');
        itemElement.classList.add('meeting-participant');
        itemElement.tabIndex = 0;
        itemElement.setAttribute('role', 'button');
        itemElement.setAttribute('aria-pressed', 'false');
        itemElement.draggable = false;

        const numberElement: HTMLSpanElement = document.createElement('span');
        numberElement.classList.add('meeting-participant-number');
        numberElement.textContent = `${index + 1}`; // +1 cuz numbered list displayed has base index=1 vs array base index=0

        const nameElement: HTMLSpanElement = document.createElement('span');
        nameElement.classList.add('meeting-participant-name');
        nameElement.textContent = name;

        const editButtonElement: HTMLButtonElement = document.createElement('button');
        editButtonElement.type = 'button';
        editButtonElement.classList.add('meeting-participant-edit');
        editButtonElement.setAttribute('aria-label', `Edit ${name}`);
        editButtonElement.innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i>';

        itemElement.appendChild(numberElement);
        itemElement.appendChild(nameElement);
        itemElement.appendChild(editButtonElement);

        itemElement.addEventListener('click', () => {
            ParticipantList.toggleParticipantSelection(itemElement);
        });

        itemElement.addEventListener('dragstart', (event: DragEvent) => {
            if (!ParticipantList.isEditModeEnabled || itemElement.classList.contains('is-editing') || event.target instanceof HTMLButtonElement || event.target instanceof HTMLInputElement) {
                event.preventDefault();
                return;
            }

            ParticipantList.draggedItem = itemElement;
            itemElement.classList.add('is-dragging');

            if (event.dataTransfer) {
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/plain', itemElement.querySelector('.meeting-participant-name')?.textContent?.trim() ?? '');
            }
        });

        itemElement.addEventListener('dragover', (event: DragEvent) => {
            if (!ParticipantList.isEditModeEnabled || !ParticipantList.draggedItem || ParticipantList.draggedItem === itemElement) {
                return;
            }

            event.preventDefault();
            const listElement: HTMLUListElement | null = itemElement.parentElement as HTMLUListElement | null;
            if (!listElement) {
                return;
            }

            const itemBounds: DOMRect = itemElement.getBoundingClientRect();
            const pointerY: number = event.clientY;
            const shouldInsertAfter: boolean = pointerY > itemBounds.top + (itemBounds.height / 2);
            const nextSibling: ChildNode | null = shouldInsertAfter ? itemElement.nextSibling : itemElement;

            if (nextSibling !== ParticipantList.draggedItem) {
                listElement.insertBefore(ParticipantList.draggedItem, nextSibling);
                ParticipantList.refreshParticipantNumbers(listElement);
            }
        });

        itemElement.addEventListener('drop', (event: DragEvent) => {
            if (!ParticipantList.isEditModeEnabled || !ParticipantList.draggedItem) {
                return;
            }

            event.preventDefault();
            const listElement: HTMLUListElement | null = itemElement.parentElement as HTMLUListElement | null;
            if (listElement) {
                ParticipantList.refreshParticipantNumbers(listElement);
            }
        });

        itemElement.addEventListener('dragend', () => {
            itemElement.classList.remove('is-dragging');

            const listElement: HTMLUListElement | null = itemElement.parentElement as HTMLUListElement | null;
            if (listElement) {
                ParticipantList.refreshParticipantNumbers(listElement);
            }

            ParticipantList.draggedItem = null;
        });

        itemElement.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.target instanceof HTMLInputElement || itemElement.classList.contains('is-editing')) {
                return;
            }

            const key: string = event.key;
            if (ParticipantList.isEditModeEnabled && (key === 'Enter' || key === ' ')) {
                event.preventDefault();
                return;
            }

            if (key === 'Enter' || key === ' ') {
                event.preventDefault();
                ParticipantList.toggleParticipantSelection(itemElement);
            }
        });

        editButtonElement.addEventListener('mousedown', (event: MouseEvent) => {
            if (ParticipantList.activeEditButton === editButtonElement && ParticipantList.activeEditInput) {
                event.preventDefault();
                event.stopPropagation();
                ParticipantList.suppressedEditButton = editButtonElement;
                ParticipantList.finishActiveEdit();
            }
        });

        editButtonElement.addEventListener('click', (event: MouseEvent) => {
            event.stopPropagation();

            if (ParticipantList.suppressedEditButton === editButtonElement) {
                ParticipantList.suppressedEditButton = null;
                return;
            }

            ParticipantList.beginInlineEdit(itemElement, nameElement, editButtonElement);
        });

        return itemElement;
    }

    private static beginInlineEdit(itemElement: HTMLLIElement, nameElement: HTMLSpanElement, editButtonElement: HTMLButtonElement): void {
        Logger.log(Logger.LogLevel.TRACE, ParticipantList, ParticipantList.beginInlineEdit);

        if (!ParticipantList.isEditModeEnabled) {
            return;
        }

        if (ParticipantList.activeEditInput) {
            ParticipantList.finishActiveEdit();
        }

        const originalName: string = nameElement.textContent?.trim() ?? '';
        let hasCommittedEdit: boolean = false;
        itemElement.classList.add('is-editing');
        itemElement.draggable = false;
        ParticipantList.lockMeetingBoardWidth();
        ParticipantList.activeEditButton = editButtonElement;

        const inputElement: HTMLInputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.value = originalName;
        inputElement.classList.add('meeting-participant-input');
        inputElement.setAttribute('aria-label', 'Edit participant name');
        inputElement.draggable = false;

        itemElement.insertBefore(inputElement, editButtonElement);
        ParticipantList.activeEditInput = inputElement;

        const commitEdit = (): void => {
            if (hasCommittedEdit) {
                return;
            }

            hasCommittedEdit = true;
            const updatedName: string = inputElement.value.trim();
            nameElement.textContent = updatedName.length > 0 ? updatedName : originalName;
            editButtonElement.setAttribute('aria-label', `Edit ${nameElement.textContent ?? originalName}`);
            itemElement.classList.remove('is-editing');
            itemElement.draggable = ParticipantList.isEditModeEnabled;
            ParticipantList.activeEditInput = null;
            ParticipantList.activeEditButton = null;
            ParticipantList.unlockMeetingBoardWidth();

            if (inputElement.isConnected) {
                inputElement.remove();
            }
        };

        inputElement.addEventListener('click', (event: MouseEvent) => {
            event.stopPropagation();
        });

        inputElement.addEventListener('dragstart', (event: DragEvent) => {
            event.preventDefault();
        });

        inputElement.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                commitEdit();
            }

            if (event.key === 'Escape') {
                event.preventDefault();
                inputElement.value = originalName;
                commitEdit();
            }
        });

        inputElement.addEventListener('blur', () => {
            commitEdit();
        }, { once: true });

        inputElement.focus();
        inputElement.select();
    }

    private static finishActiveEdit(): void {
        if (ParticipantList.activeEditInput) {
            ParticipantList.activeEditInput.blur();
        }
    }

    private static lockMeetingBoardWidth(): void {
        const meetingBoardElement: HTMLElement | null = document.querySelector('.meeting-board');
        if (!meetingBoardElement) {
            return;
        }

        ParticipantList.lockedBoardWidth = `${meetingBoardElement.getBoundingClientRect().width}px`;
        meetingBoardElement.style.width = ParticipantList.lockedBoardWidth;
    }

    private static unlockMeetingBoardWidth(): void {
        const meetingBoardElement: HTMLElement | null = document.querySelector('.meeting-board');
        if (!meetingBoardElement) {
            return;
        }

        meetingBoardElement.style.removeProperty('width');
        ParticipantList.lockedBoardWidth = null;
    }

    private static updateEditModeToggleLabel(buttonLabelElement: HTMLSpanElement | null, isEditModeEnabled: boolean): void {
        if (!buttonLabelElement) {
            return;
        }

        buttonLabelElement.textContent = isEditModeEnabled
            ? ParticipantList.editModeEnabledLabel
            : ParticipantList.editModeDisabledLabel;
    }

    private static updateParticipantEditModeState(): void {
        const participantItems: NodeListOf<HTMLLIElement> = document.querySelectorAll('.meeting-participant');
        participantItems.forEach((itemElement) => {
            itemElement.draggable = ParticipantList.isEditModeEnabled && !itemElement.classList.contains('is-editing');
        });
    }

    private static refreshParticipantNumbers(listElement: HTMLUListElement): void {
        const participantItems: HTMLLIElement[] = Array.from(listElement.querySelectorAll('.meeting-participant'));
        let activeParticipantNumber: number = 1;

        participantItems.forEach((itemElement, index) => {
            const numberElement: HTMLSpanElement | null = itemElement.querySelector('.meeting-participant-number');
            if (numberElement) {
                const isExcluded: boolean = itemElement.classList.contains('is-excluded');
                const shouldShowCrossedOutState: boolean = isExcluded;

                numberElement.classList.toggle('is-crossed-out', shouldShowCrossedOutState);

                if (shouldShowCrossedOutState) {
                    numberElement.textContent = 'X';
                    numberElement.setAttribute('aria-label', 'Excluded participant');
                    return;
                }

                const displayNumber: number = activeParticipantNumber;
                numberElement.textContent = `${displayNumber}`;
                numberElement.setAttribute('aria-label', `Participant ${displayNumber}`);
                activeParticipantNumber += 1;
            }
        });
    }

    private static refreshAllParticipantNumbers(): void {
        const listElement: HTMLUListElement | null = document.querySelector('#participants-list ul');
        if (listElement) {
            ParticipantList.refreshParticipantNumbers(listElement);
        }
    }
}