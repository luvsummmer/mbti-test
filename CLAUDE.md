# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MBTI 공부법 연구소 — MBTI 유형별 공부법을 소개하는 정적 콘텐츠 사이트. 여러 개의 HTML 페이지로 구성된다.

## Design System

- 배경: 크림톤
- 포인트 컬러: 보라 계열
- 폰트: Pretendard
- 레이아웃: 모바일 반응형 필수 (모든 페이지)

## Hard Constraints

1. **서버·API·백엔드 키를 절대 사용하지 않는다.** 정적 파일(HTML/CSS/JS)만으로 동작해야 한다. 외부 API 호출, 서버 사이드 로직, 환경변수 기반 키 사용 금지.
2. **파일이 300줄을 넘으면 먼저 분리를 제안한다.** 300줄을 초과할 것 같으면 바로 쪼개지 말고, 어떻게 나눌지 사용자에게 먼저 제안한 뒤 진행한다.
