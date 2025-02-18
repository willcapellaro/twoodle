document.addEventListener("DOMContentLoaded", function () {
    const votes = document.querySelectorAll("input.vote");

    // Load votes from localStorage
    votes.forEach((vote, index) => {
        const savedVote = localStorage.getItem(`vote-${index}`);
        if (savedVote !== null) {
            vote.dataset.vote = savedVote;
            vote.checked = savedVote == 1;
            vote.indeterminate = savedVote == 2;
            
            // Ensure label is updated
            updateLabel(vote);
        }
    });

    // Event listener for vote changes
    votes.forEach((vote, index) => {
        vote.addEventListener("click", function () {
            const stateMapping = {
                0: { next: 1, label: "Your Pick", checked: true, indeterminate: false },
                1: { next: 2, label: "Backup", checked: false, indeterminate: true },
                2: { next: 0, label: "", checked: false, indeterminate: false }
            };

            const currentState = this.dataset.vote || 0;
            const nextState = stateMapping[currentState];

            this.dataset.vote = nextState.next;
            this.checked = nextState.checked;
            this.indeterminate = nextState.indeterminate;

            // Save to localStorage
            localStorage.setItem(`vote-${index}`, nextState.next);
            
            // Update label
            updateLabel(this);
        });
    });

    function updateLabel(input) {
        let label = input.nextElementSibling;
        if (!label || !label.classList.contains("vote-label")) {
            label = document.createElement("span");
            label.classList.add("vote-label");
            input.after(label);
        }
        const labelMap = { 1: "Your Pick", 2: "Backup", 0: "" };
        label.textContent = labelMap[input.dataset.vote] || "";
    }
});
