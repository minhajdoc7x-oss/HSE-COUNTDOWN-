function updateUI() {
    const now = new Date();
    const tableBody = document.getElementById('table-body');
    
    // അടുത്ത പരീക്ഷ കണ്ടെത്തുന്നു (12:15 PM കഴിഞ്ഞാൽ അടുത്തതിലേക്ക് മാറും)
    let nextExam = exams.find(e => {
        const examEndTime = new Date(e.date);
        examEndTime.setHours(12, 15, 0); 
        return examEndTime > now;
    });

    // ടേബിൾ അപ്‌ഡേറ്റ് ചെയ്യുന്നു
    tableBody.innerHTML = ''; 
    exams.forEach(e => {
        const examStartTime = new Date(e.date);
        const examEndTime = new Date(e.date);
        examEndTime.setHours(12, 15, 0);

        let status = "";
        let rowStyle = "";

        if (now > examEndTime) {
            status = "<span style='color:#94a3b8'>Done</span>";
            rowStyle = "opacity:0.4";
        } else if (now >= examStartTime && now <= examEndTime) {
            status = "<span class='live-tag'>LIVE</span>"; // CSS-ലെ പൾസ് ആനിമേഷൻ ലഭിക്കാൻ
            rowStyle = "background-color: rgba(28, 200, 138, 0.1)";
        } else if (now.toDateString() === examStartTime.toDateString()) {
            status = "<span class='today-tag'>TODAY</span>";
        } else {
            const diffTime = examStartTime - now;
            // ടൈമറുമായി ഒത്തുപോകാൻ Math.floor ഉപയോഗിക്കുക
            const daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            status = `<span class="days-tag">${daysLeft}d to go</span>`;
        }

        const isNext = nextExam && e.name === nextExam.name;
        tableBody.innerHTML += `
            <tr class="${isNext ? 'next-exam-row' : ''}" style="${rowStyle}">
                <td>${examStartTime.getDate()} Mar</td>
                <td>${e.name}</td>
                <td style="text-align: right;">${status}</td>
            </tr>`;
    });

    // ടൈമർ അപ്‌ഡേറ്റ് ചെയ്യുന്നു
    if (nextExam) {
        const startTime = new Date(nextExam.date);
        const endTime = new Date(nextExam.date);
        endTime.setHours(12, 15, 0);

        if (now >= startTime && now <= endTime) {
            document.getElementById('timer').innerText = "Exam is Live!";
            document.getElementById('timer').style.color = "var(--success)";
            document.getElementById('exam-name').innerText = "Running: " + nextExam.name;
        } else {
            const diff = startTime - now;
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            
            document.getElementById('timer').innerText = `${d}d ${h}h ${m}m ${s}s`;
            document.getElementById('timer').style.color = "var(--accent)";
            document.getElementById('exam-name').innerText = "Target: " + nextExam.name;
        }
    } else {
        document.getElementById('timer').innerText = "All Exams Over!";
        document.getElementById('exam-name').innerText = "Success!";
    }
}
