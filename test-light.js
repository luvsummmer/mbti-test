const GROUPS = {
  NT: { icon: '🧠', code: 'NT', alias: '전략가형 학습자', desc: '논리와 원리로 이해하는 스타일이에요. 암기보다 "왜?"를 파고들 때 효율이 올라가요.', href: 'nt.html' },
  NF: { icon: '🌱', code: 'NF', alias: '이상주의자형 학습자', desc: '의미와 가치, 사람과의 연결 속에서 몰입도가 올라가는 스타일이에요.', href: 'nf.html' },
  ST: { icon: '🛠️', code: 'ST', alias: '실무가형 학습자', desc: '구체적 사실과 검증된 방법을 논리적으로 익히는 스타일이에요.', href: 'st.html' },
  SF: { icon: '🤝', code: 'SF', alias: '협력가형 학습자', desc: '실생활과 연결된 내용을 사람들과 함께 배울 때 효율이 오르는 스타일이에요.', href: 'sf.html' },
  NJ: { icon: '🎯', code: 'NJ', alias: '설계자형 학습자', desc: '큰 그림의 목표를 세우고 체계적인 계획대로 꾸준히 실행하는 스타일이에요.', href: 'nj.html' },
  NP: { icon: '💡', code: 'NP', alias: '아이디어형 학습자', desc: '흥미와 영감을 따라 유연하게, 마감 직전 몰입 폭발력을 내는 스타일이에요.', href: 'np.html' },
  SJ: { icon: '📋', code: 'SJ', alias: '관리자형 학습자', desc: '정해진 루틴을 성실하게 지키며 꾸준히 쌓아가는 스타일이에요.', href: 'sj.html' },
  SP: { icon: '⚡', code: 'SP', alias: '행동가형 학습자', desc: '몸으로 직접 부딪히며 실전 감각으로 배우는 스타일이에요.', href: 'sp.html' }
};

const TOTAL_QUESTIONS = document.querySelectorAll('.question-card').length;

function updateProgress() {
  const answered = document.querySelectorAll('.question-card input:checked').length;
  document.getElementById('progressBar').style.width = (answered / TOTAL_QUESTIONS * 100) + '%';
  return answered;
}

document.querySelectorAll('.question-card').forEach(card => {
  card.querySelectorAll('.option').forEach(opt => {
    opt.addEventListener('click', () => {
      card.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      opt.querySelector('input').checked = true;
      updateProgress();
    });
  });
});

function buildBarRow(code, score, isTop) {
  const row = document.createElement('div');
  row.className = 'result-bar-row';
  row.innerHTML =
    '<span class="label">' + code + '</span>' +
    '<span class="result-bar-track"><span class="result-bar-fill" style="width:0%"></span></span>' +
    '<span class="val">' + Math.round(score) + '%</span>';
  if (isTop) row.style.color = 'var(--pink-dark)';
  const fill = row.querySelector('.result-bar-fill');
  requestAnimationFrame(() => { fill.style.width = score + '%'; });
  return row;
}

function renderResultCard(containerId, candidates, scores, topCode) {
  const container = document.getElementById(containerId);
  const top = GROUPS[topCode];
  container.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'result-card';
  card.innerHTML =
    '<span class="icon-big">' + top.icon + '</span>' +
    '<h2>' + top.code + ' · ' + top.alias + '</h2>' +
    '<p class="desc">' + top.desc + '</p>';

  const barsWrap = document.createElement('div');
  barsWrap.className = 'result-bars';
  candidates.forEach(code => {
    barsWrap.appendChild(buildBarRow(code, scores[code], code === topCode));
  });
  card.appendChild(barsWrap);

  const linkBtn = document.createElement('a');
  linkBtn.href = top.href;
  linkBtn.className = 'btn btn-primary btn-block';
  linkBtn.textContent = top.code + ' 그룹 자세히 보기 →';
  card.appendChild(linkBtn);

  container.appendChild(card);
  return top;
}

function calculateResults() {
  const counts = { N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };
  document.querySelectorAll('.question-card input:checked').forEach(input => {
    counts[input.value]++;
  });

  const nsTotal = counts.N + counts.S;
  const tfTotal = counts.T + counts.F;
  const jpTotal = counts.J + counts.P;

  const npct = Math.round((counts.N / nsTotal) * 100);
  const spct = 100 - npct;
  const tpct = Math.round((counts.T / tfTotal) * 100);
  const fpct = 100 - tpct;
  const jpct = Math.round((counts.J / jpTotal) * 100);
  const ppct = 100 - jpct;

  const set1Scores = {
    NT: (npct + tpct) / 2,
    NF: (npct + fpct) / 2,
    ST: (spct + tpct) / 2,
    SF: (spct + fpct) / 2
  };
  const set2Scores = {
    NJ: (npct + jpct) / 2,
    NP: (npct + ppct) / 2,
    SJ: (spct + jpct) / 2,
    SP: (spct + ppct) / 2
  };

  const top1 = Object.keys(set1Scores).reduce((a, b) => set1Scores[a] >= set1Scores[b] ? a : b);
  const top2 = Object.keys(set2Scores).reduce((a, b) => set2Scores[a] >= set2Scores[b] ? a : b);

  const g1 = renderResultCard('result1', ['NT', 'NF', 'ST', 'SF'], set1Scores, top1);
  const g2 = renderResultCard('result2', ['NJ', 'NP', 'SJ', 'SP'], set2Scores, top2);

  document.getElementById('shareBtn').dataset.text =
    '나의 공부 유형은 [' + g1.code + '] ' + g1.alias + ' + [' + g2.code + '] ' + g2.alias + '! MBTI 공부법 연구소에서 나도 확인해보기';

  document.getElementById('testForm').style.display = 'none';
  document.getElementById('resultSection').style.display = 'block';
  document.getElementById('formError').textContent = '';
  document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('submitBtn').addEventListener('click', () => {
  if (updateProgress() < TOTAL_QUESTIONS) {
    document.getElementById('formError').textContent = '모든 문항에 답해주세요. (' + updateProgress() + '/' + TOTAL_QUESTIONS + ')';
    return;
  }
  calculateResults();
});

document.getElementById('retakeBtn').addEventListener('click', () => {
  document.querySelectorAll('.question-card input:checked').forEach(i => i.checked = false);
  document.querySelectorAll('.option.selected').forEach(o => o.classList.remove('selected'));
  document.getElementById('progressBar').style.width = '0%';
  document.getElementById('resultSection').style.display = 'none';
  document.getElementById('testForm').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('shareBtn').addEventListener('click', async function () {
  const text = this.dataset.text || 'MBTI 공부법 연구소에서 내 공부유형을 확인해보세요!';
  const url = location.href.split('#')[0];
  if (navigator.share) {
    try { await navigator.share({ title: 'MBTI 공부법 연구소', text, url }); }
    catch (e) { /* 사용자가 공유 취소 */ }
    return;
  }
  try {
    await navigator.clipboard.writeText(text + ' ' + url);
    const original = this.textContent;
    this.textContent = '링크가 복사되었어요!';
    setTimeout(() => { this.textContent = original; }, 2000);
  } catch (e) {
    const original = this.textContent;
    this.textContent = '복사에 실패했어요';
    setTimeout(() => { this.textContent = original; }, 2000);
  }
});
