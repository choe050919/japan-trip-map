# 여행 계획 데이터 구조

`itineraries.js`는 지도에 표시할 계획을 보관합니다. 브라우저에서 로컬 파일로 열어도 동작하도록 JSON과 동일한 객체를 `window.TRIP_ITINERARIES`에 할당합니다.

## 후보지 자동 추가

구글맵 주소와 사람 이름만 넣어 `places.js`를 업데이트할 수 있습니다.

```bash
node scripts/add-place.js --url "구글맵 주소" --people "예담,정우"
```

선택값도 함께 넣을 수 있습니다.

```bash
node scripts/add-place.js \
  --url "https://www.google.com/maps/place/..." \
  --people "진서" \
  --city "후쿠오카" \
  --area "텐진" \
  --category "맛집" \
  --note "가보고 싶은 후보"
```

- `people`: `예담`, `정우`, `진서`, `현승`, `두림` 중 쉼표로 입력
- `category`: `볼거리`, `산책`, `쇼핑`, `맛집`, `카페`, `체험` 중 하나
- 같은 `name` 또는 같은 `mapUrl`이 이미 있으면 새 항목을 만들지 않고 `people`을 합쳐 업데이트합니다.
- 짧은 `maps.app.goo.gl` 링크는 실행 환경에서 네트워크가 가능하면 원본 구글맵 URL로 따라가 좌표와 이름을 추출합니다.
- 저장 전에 결과만 확인하려면 `--dry-run`을 붙입니다.

## Google Sheets 동기화

여러 사람이 장소를 추가할 때는 Google Sheets에 새 후보지를 적고 GitHub Actions가 `data/places.js`에 병합합니다. 기존 `places.js`의 후보지는 유지되고, 시트의 후보지가 기존 `name` 또는 `mapUrl`과 겹치지 않을 때만 뒤에 추가됩니다.

### 1. 시트 컬럼 만들기

첫 행에 아래 컬럼명을 넣습니다.

```text
name | googleMapUrl | city | area | category | people | note | lat | lng | aliases | enabled
```

- `name`: 장소명. 비워두면 구글맵 URL에서 읽을 수 있을 때 자동 추출합니다.
- `googleMapUrl`: 구글맵 공유 주소. `maps.app.goo.gl` 짧은 주소도 시도합니다.
- `city`: 예: `후쿠오카`, `구마모토`, `나가사키`
- `area`: 예: `텐진`
- `category`: `볼거리`, `산책`, `쇼핑`, `맛집`, `카페`, `체험` 중 하나
- `people`: `예담`, `정우`, `진서`, `현승`, `두림` 중 쉼표로 입력
- `note`: 지도 카드와 복사 텍스트에 표시할 메모
- `lat`, `lng`: 좌표. 구글맵 URL에서 좌표 추출이 안 될 때 필수입니다.
- `aliases`: 검색용 별칭. 선택값입니다.
- `enabled`: `false`, `no`, `0`, `숨김`이면 동기화에서 제외합니다.

### 2. CSV URL 만들기

Google Sheets에서 `파일 > 공유 > 웹에 게시`를 선택하고, 게시 형식을 `쉼표로 구분된 값(.csv)`로 설정합니다.

생성된 CSV URL을 GitHub 저장소의 `Settings > Secrets and variables > Actions > New repository secret`에 등록합니다.

```text
Name: GOOGLE_SHEET_CSV_URL
Secret: 게시된 Google Sheets CSV URL
```

### 3. GitHub Actions 실행

`.github/workflows/sync-places.yml`이 30분마다 자동 실행됩니다. 바로 반영하려면 GitHub의 `Actions > Sync places from Google Sheets > Run workflow`를 누릅니다.

동작 순서:

```text
기존 data/places.js
  + Google Sheets CSV
  -> scripts/sync-places-from-sheet.js
  -> data/places.js 병합 생성
  -> GitHub Actions가 변경분 커밋
  -> GitHub Pages에서 trip-map.html이 갱신된 places.js 사용
```

## 계획 추가

`plans` 배열에 다음 구조의 객체를 추가합니다.

```js
{
  id: "고유-id",
  name: "화면에 보일 계획 이름",
  source: "원본 파일명",
  startDate: "2026-06-26",
  endDate: "2026-07-01",
  description: "계획 요약",
  accommodations: [],
  days: [
    {
      id: "고유-day-id",
      dayNumber: 1,
      date: "2026-06-26",
      title: "하루 제목",
      color: "#f36f45",
      summary: "하루 요약",
      tips: ["팁"],
      items: []
    }
  ]
}
```

## 숙소

`accommodations` 배열에 숙박 기간과 좌표를 저장합니다.

- `checkIn`, `checkOut`: `YYYY-MM-DD` 형식
- `precision`: `exact` 또는 `approximate`
- `bookingUrl`: 예약 페이지
- `mapUrl`: 정확한 별도 지도 링크가 있을 때 선택적으로 사용

Airbnb처럼 예약 전에 정확한 주소를 숨기는 숙소는 공개 지도 좌표를 사용하고 `precision: "approximate"`로 표시합니다.

## 일정 항목

- `kind`: `place`, `anchor`, `meal`, `transfer`, `note` 중 하나
- `start`, `end`: `HH:MM` 형식. 미정이면 생략 가능
- `title`: 화면에 표시할 이름
- `placeName`: 지도 후보지의 `name`과 정확히 같으면 기존 좌표와 태그 재사용
- `lat`, `lng`: 후보지에 없는 장소의 좌표
- `details`: 일정 설명
- `transit`: 앞뒤 이동에 관한 메모

좌표가 있는 `place`와 `anchor`만 지도에 번호 핀으로 표시되고 방문 순서대로 안내선이 연결됩니다. 식사와 이동 항목은 타임라인에만 표시됩니다.
