import Header from "../../shared/components/Header.jsx";
import OKButton from "../../shared/components/UI/OKButton.js";

function AlphabetPage() {
  const alphabet = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(i + 65)
  );
  return (
    <>
      <Header link="/" isLogged={false} pageName={"Alphabet"} />
      <main className="alphabet">
        <h1 className="alphabet__title font-regular">L'alphabet</h1>
        <div className="alphabet__container">
          <div className="alphabet__list">
            {alphabet.map((lettre, index) => (
              <span className="alphabet__listItem font-script" key={index}>
                {lettre}
              </span>
            ))}
          </div>

          <div className="alphabet__list">
            {alphabet.map((lettre, index) => (
              <span className="alphabet__listItem font-cursiv" key={index}>
                {lettre.toLowerCase()}
              </span>
            ))}
          </div>
        </div>

        <OKButton pt={8} link={"/exercice/alphabet"} />
      </main>
    </>
  );
}

export default AlphabetPage;
