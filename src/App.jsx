import { useRef, useState, useEffect } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

// 새로고침 시 localStorage에 저장된(이전에 선택-삭제하지 않은) 장소 정보 표시
const savedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
const savedPlaces = savedIds.map((id) => {
  return AVAILABLE_PLACES.find((place) => place.id === id);
});
// 에러 해결 return 명시 : find가 반환한 값을 명시적으로 return해야 map함수가 각 id에 해당하는 장소를 배열로 반환할 수 있다.
// filter로 find가 찾지 못한 경우 반환하는 undefined를 걸러내 오류를 방지해주는 게 좋다.(해당 앱에서는 id가 모두 일치하므로 필요없음)

function App() {
  // console.log(savedIds);
  // console.log(savedPlaces);
  const [ModalIsOpen, setModalIsOpen] = useState(false);
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(savedPlaces);
  const [sortedPlaces, setSortedPlaces] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(
        AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude
      );

      setSortedPlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    // modal.current.open();
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    // modal.current.close();
    setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    // [부수 효과] 로컬스토리지에 id 저장
    const storedId = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    if (storedId.indexOf(id) === -1) {
      localStorage.setItem("selectedPlaces", JSON.stringify([id, ...storedId]));
    }
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    // modal.current.close();
    setModalIsOpen(false);

    // [부수 효과] 로컬 스토리지에서 id 삭제
    const storedIds = JSON.parse(localStorage.getItem("selectedPlaces")) || [];
    localStorage.setItem(
      "selectedPlaces",
      JSON.stringify(storedIds.filter((id) => id !== selectedPlace.current))
    );
  }

  return (
    <>
      <Modal open={ModalIsOpen} onClose={handleStopRemovePlace}>
        {ModalIsOpen && <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />}
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={sortedPlaces}
          fallbackText="장소를 거리순으로 정렬합니다..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
