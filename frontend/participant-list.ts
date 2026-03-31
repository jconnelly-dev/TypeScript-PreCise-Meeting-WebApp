import { Logger } from './logger.js';

export class ParticipantList {

    public static toggleParticipantSelection(itemElement: HTMLLIElement): void {
        Logger.log(Logger.LogLevel.TRACE, ParticipantList, ParticipantList.toggleParticipantSelection);

        const isSelected: boolean = itemElement.classList.toggle('is-selected');
        itemElement.setAttribute('aria-pressed', `${isSelected}`);
    }

    public static createParticipantListItem(name: string, index: number): HTMLLIElement {
        const itemElement: HTMLLIElement = document.createElement('li');
        itemElement.classList.add('meeting-participant');
        itemElement.tabIndex = 0;
        itemElement.setAttribute('role', 'button');
        itemElement.setAttribute('aria-pressed', 'false');

        const numberElement: HTMLSpanElement = document.createElement('span');
        numberElement.classList.add('meeting-participant-number');
        numberElement.textContent = `${index + 1}`; // +1 cuz numbered list displayed has base index=1 vs array base index=0

        const nameElement: HTMLSpanElement = document.createElement('span');
        nameElement.classList.add('meeting-participant-name');
        nameElement.textContent = name;

        itemElement.appendChild(numberElement);
        itemElement.appendChild(nameElement);

        itemElement.addEventListener('click', () => {
            ParticipantList.toggleParticipantSelection(itemElement);
        });

        itemElement.addEventListener('keydown', (event: KeyboardEvent) => {
            const key: string = event.key;
            if (key === 'Enter' || key === ' ') {
                event.preventDefault();
                ParticipantList.toggleParticipantSelection(itemElement);
            }
        });

        return itemElement;
    }
}