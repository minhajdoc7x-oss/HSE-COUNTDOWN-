// 1. എക്സാം ഡാറ്റ
const exams = [
    { date: "2026-03-10T09:30:00", name: "Business Studies" },
    { date: "2026-03-12T09:30:00", name: "Second Language" },
    { date: "2026-03-19T09:30:00", name: "Economics" },
    { date: "2026-03-24T09:30:00", name: "Computer Applications" },
    { date: "2026-03-26T09:30:00", name: "Accountancy" },
    { date: "2026-03-28T09:30:00", name: "English (Part I)" }
];

let lastMinute = -1;

// 2. ഓഡിയോ സെറ്റിംഗ്സ്
// ഫയൽ നെയിം കൃത്യമാണെന്ന് ഉറപ്പുവരുത്തുക
const audioFile = "WhatsApp Audio 2026-02-24 at 10.57.28 AM.mpga";
const bgAudio = new Audio(audioFile);
bgAudio.loop = true; // അവസാനിച്ചാൽ വീണ്ടും പ്ലേ ആകും (Repeat)
let isPlaying = false;

// 3. സ്ക്രീനിൽ ടച്ച് ചെയ്യുമ്പോൾ പ്ലേ/പോസ് ആകാനുള്ള ഫങ്ക്ഷൻ
document.addEventListener('click', function() {
    if (!isPlaying) {
        bgAudio.play().then(() => {
            isPlaying = true;
        }).catch(err => {
            console.log("Play block ആയി. വീണ്ടും ടച്ച് ചെയ്യുക.");
        });
    } else {
        bgAudio.pause();
        isPlaying = false;
    }
});

// 4. കൗണ്ട്ഡൗൺ അപ്ഡേറ്റ് ഫങ്ക്ഷൻ
function updateUI() {
    const now = new Date();
    const tableBody = document.getElementById('table-body');
    let nextExam = exams.find(e => new Date(e.date) > now);

    if (lastMinute !== now.getMinutes()) {
        tableBody.innerHTML = '';
        exams.forEach(e => {
            const examDate = new Date(e.date);
            const isNext = nextExam && e.name === nextExam.name;
            const isPast = examDate < now;
            const diffTime = examDate - now;
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let status = isPast ? "<span style='color:#94a3b8'>Done</span>" : `<span class="days-tag">${daysLeft}d to go</span>`;
            
            tableBody.innerHTML += `
                <tr class="${isNext ? 'next-exam-row' : ''}" style="${isPast ? 'opacity:0.4' : ''}">
                    <td>${examDate.getDate()} Mar</td>
                    <td>${e.name}</td>
                    <td style="text-align: right;">${status}</td>
                </tr>`;
        });
        lastMinute = now.getMinutes();
    }

    if (nextExam) {
        const diff = new Date(nextExam.date) - now;
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        
        document.getElementById('timer').innerText = 
            `${d.toString().padStart(2, '0')}d ${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
        document.getElementById('exam-name').innerText = "Target: " + nextExam.name;
    } else {
        document.getElementById('timer').innerText = "All Exams Over!";
        document.getElementById('exam-name').innerText = "Success!";
        document.getElementById('timer').style.color = "var(--success)";
    }
}

// ഓരോ സെക്കന്റിലും അപ്ഡേറ്റ് ചെയ്യുക
setInterval(updateUI, 1000);
updateUI();
