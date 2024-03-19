# 2024 capstone 03

[![Python package](https://github.com/kookmin-sw/capstone-2024-03/actions/workflows/python-package.yml/badge.svg)](https://github.com/kookmin-sw/capstone-2024-03/actions/workflows/python-package.yml)

## 프로젝트 소개

사용자가 작성한 자동화 시나리오에 따라 스마트폰 제어하여 반복업무를 대신 수행하며 생산성을 높이고, 창의적인 업무에 매진할 수 있게 돕는다.

이 때 시나리오 작성은 코드가 아닌 유저 친화적인 양식(Form)과 끌어놓기 (Drag and Drop) 기능을 지원하여 누구나 사용할 수 있는 범용성을 가진다.

## Abstract

Automation scenarios are created by users and controlled by android to take over repetitive tasks (operator), increasing productivity.

Scenario creation is user-friendly forms and drag & drop functionality rather than coding, making it universal to everyone.

## 영상

_프로젝트 소개하는 영상을 추가하세요._

* 중간 발표 영상

* 최종 발표 영상

## 팀 소개

|이름|프로필 사진 | 역할 | 깃허브|
| - | - | - | - | 
| **신민욱 (\*\*\*\*1640 )** | <img src="https://avatars.githubusercontent.com/u/12551635?v=4" width="100" height="100"/> | 서버, 클라이언트, 문서화 | [https://github.com/minwook-shin](https://github.com/minwook-shin) | 
| **임덕규 (산학 멘토)** | <img src="https://avatars.githubusercontent.com/u/1933975?v=4" width="100" height="100"/> | 프로젝트 멘토링 | [https://github.com/RavenKyu](https://github.com/RavenKyu) |

## 개발 환경 설정 및 사용법

해당 프로젝트의 시작을 위해서 서버의 환경 설정을 먼저 진행해주셔야 합니다.

### 서버

#### Windows

1. 파이썬 3.10 ~ 3.12 설치: 

[Python 공식 웹사이트](https://www.python.org/downloads/)에서 Python 3.10 ~ 3.12 버전을 내려받고 설치

2. 가상환경 생성: 

```powershell
python -m venv .venv
.\venv\Scripts\activate
```

#### macOS

1. 파이썬 3.10 ~ 3.12 설치:

```bash
brew install python@3.12
```

2. 가상환경 생성:

```bash
python3 -m venv .venv
source venv/bin/activate
```

#### Linux

1. 파이썬 3.10 ~ 3.12 설치:

```bash
sudo apt-get install python3.12
```

2. 가상환경 생성:

```bash
python3 -m venv venv
source venv/bin/activate
```

#### 모든 플랫폼

```bash
pip install -r apps/adb-api/requirements.txt
```

### 클라이언트

#### Windows

1. Node.js 개발환경 구축:

[Node.js 공식 웹사이트](https://nodejs.org/en/download/)에서 Node.js를 내려받고 설치

#### macOS

1. Node.js 개발환경 구축:

```bash
brew install node
```

#### Linux

1. Node.js 개발환경 구축:

```bash
sudo apt-get install nodejs
```

#### 모든 플랫폼

```bash
npm install
npm start
```

## 문서

해당 프로젝트의 구조 및 API 설계에 대한 내용은 [위키](https://github.com/kookmin-sw/capstone-2024-03/wiki) 를 참고해주세요.
