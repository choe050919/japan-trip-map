# 여행 계획 데이터 구조

`itineraries.js`는 지도에 표시할 계획을 보관합니다. 브라우저에서 로컬 파일로 열어도 동작하도록 JSON과 동일한 객체를 `window.TRIP_ITINERARIES`에 할당합니다.

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
