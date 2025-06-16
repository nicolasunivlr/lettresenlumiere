import Header from '../components/Header';
const Credits = () => {
  const teamMembers = [
    { name: 'Baptiste Pereira', role: 'Développeur FullStack' },
    { name: 'Maxence Hirault', role: 'Développeur FullStack' },
    { name: 'Raphaël Benmimoune', role: 'Développeur FullStack' },
    { name: 'Johan Canevet-Danois', role: 'Développeur FullStack' },
    { name: 'Angelo Palmino', role: 'Développeur FullStack' },
    { name: 'Nicolas Trugeon', role: 'Développeur et gestion de projet' },
  ];

  return (
    <>
      <Header link='/' pageName={'Crédits'} />
      <div className='min-h-screen bg-opacity-50 flex flex-col items-center p-10'>
        <main className='min-w-[400px] w-[35vw] text-center'>
          <p className='text-2xl mb-6 text-gray-700'>
            Merci à toute l'équipe pour leur travail :
          </p>
          <div className='flex flex-wrap justify-center gap-8 mb-10 '>
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className='min-w-[200px] bg-white w-[11vw] p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-all'
              >
                <h2 className='text-3xl font-semibold text-gray-800'>
                  {member.name}
                </h2>
                <p className='text-xl text-gray-600'>{member.role}</p>
              </div>
            ))}
          </div>

          <div className='bg-white p-8 rounded-lg shadow-lg text-left text-gray-800 leading-relaxed'>
            <h2 className='text-2xl font-bold text-blue-800 mb-4'>
              À propos du projet
            </h2>
            <p className='mb-4'>
              Projet destiné aux apprenants de la maison centrale de
              Saint-Martin-de-Ré, réalisé par un groupe de 5 étudiants de
              l'université de La Rochelle.
            </p>
            <p className='font-semibold'>Coordination pédagogique :</p>
            <p className='mb-4'>Camille BÜRR, enseignant spécialisé</p>
            <p className='font-semibold'>Crédits photographiques :</p>
            <p className='mb-4'>Images libres de droit istockphotos.com</p>
            <p className='font-semibold'>Police de caractères :</p>
            <p className='mb-4'>Belle allure GS (cursive)</p>
            <p className='mb-4'>Verdana (scripte)</p>
            <p className='mb-4'>Trebuchet</p>
            <p className='font-semibold'>Remerciements :</p>
            <ul className='list-disc ml-6 mb-4'>
              <li>
                Merci aux personnes détenues du cours d'alphabétisation pour
                leur participation au projet.
              </li>
              <li>
                Merci à Camille BÜRR de la maison centrale pour son aide
                précieuse.
              </li>
              <li>
                Merci aux référents de la licence professionnelle MIAW et à
                l'université de La Rochelle.
              </li>
            </ul>
            <p className='font-semibold'>Note :</p>
            <p>
              Ce projet ne peut être commercialisé. Celui-ci ne pourra être
              partagé que dans le cadre de l'expérimentation menée avec le
              public analphabète ou illettré incarcéré.
            </p>
            <p className='font-semibold'>
              Projet initié par:{' '}
            </p>
            <p>- Victoria TANDAMBA</p>
            <p>- Marilyne Delia TSENE</p>
            <p>- Clarence NOIROT</p>
            <p>- Loane SENE</p>
          </div>
        </main>
      </div>
    </>
  );
};
export default Credits;
