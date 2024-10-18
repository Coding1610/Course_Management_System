import React, { useState } from 'react';

const Home = () => {
  const [index, setIndex] = useState(0);

  const forumData = [
    { title: 'SAC EVENT', instructor: 'Dr. Manish Chaturvedi', email: 'manishchaturvedi@linux.com', semester: 5, fav: 'A* Algorithm' },
    { title: 'CDC EVENT', instructor: 'Dr. Manish Chaturvedi', email: 'manishchaturvedi@linux.com', semester: 5, fav: 'A* Algorithm' },
    { title: 'DJ NIGHT', instructor: 'Dr. Manish Chaturvedi', email: 'manishchaturvedi@linux.com', semester: 5, fav: 'A* Algorithm' },
  ];

  const courseData = [
    { title: 'Machine Learning', instructor: 'Dr. Manish Chaturvedi', email: 'manishchaturvedi@linux.com', semester: 5, fav: 'A* Algorithm' },
    { title: 'Machine Learning', instructor: 'Dr. Manish Chaturvedi', email: 'manishchaturvedi@linux.com', semester: 5, fav: 'A* Algorithm' },
    { title: 'Machine Learning', instructor: 'Dr. Manish Chaturvedi', email: 'manishchaturvedi@linux.com', semester: 5, fav: 'A* Algorithm' },
  ];

  const nextCard = () => {
    setIndex((prevIndex) => (prevIndex + 1) % forumData.length);
  };

  const prevCard = () => {
    setIndex((prevIndex) => (prevIndex - 1 + forumData.length) % forumData.length);
  };

  return (
    <div className="Home">
      <h2>Academic Dashboard</h2>
      <div className="dashboard-metrics">
        <div className="metric">
          <h3>Total Students</h3>
          <p>1,200</p>
        </div>
        <div className="metric">
          <h3>Average GPA</h3>
          <p>3.5</p>
        </div>
        <div className="metric">
          <h3>Graduation Rate</h3>
          <p>85%</p>
        </div>
      </div>

      <div className="forum-section">
        <h3>Common Forum</h3>
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum architecto odit fugiat excepturi? Blanditiis aperiam, consectetur praesentium sunt fugiat maxime officiis explicabo, quia repellat qui iure et magni repellendus voluptates ipsum quos, rem aliquid itaque numquam aut. Culpa, deleniti. Soluta saepe nesciunt pariatur sequi maxime amet provident ab placeat repellendus, consequuntur ad perspiciatis omnis natus odio sapiente rem voluptatem sed fugiat? Odio, velit suscipit, obcaecati atque, pariatur veniam ex quidem enim minus iure nemo. Ipsam quae qui, porro unde molestias nulla possimus ab in nam dignissimos nesciunt aut praesentium! Dolorem molestiae necessitatibus voluptates quae nostrum aut, quam dolores. Expedita, eius? Recusandae tempore reprehenderit quae consequatur natus. Blanditiis, distinctio natus sunt doloribus itaque accusamus quis iste. Delectus odio, deserunt nam, voluptatem eligendi minus repudiandae voluptas soluta alias eum porro ipsum magnam a officia fugiat! Molestias ipsum commodi odio rem, suscipit totam nihil blanditiis nam explicabo reiciendis necessitatibus sint esse facere repellendus tempora perspiciatis cupiditate sed veritatis laudantium fuga. Adipisci ducimus doloribus, suscipit culpa architecto laboriosam ipsam voluptate eos soluta amet fugit porro iusto odit nisi nihil facilis ab! Inventore at facilis magnam culpa autem eius iure minima ullam vero amet? Ducimus et accusantium rem eos eius sequi eum repellendus, facilis repudiandae placeat dicta, id doloremque distinctio! Reprehenderit pariatur repellat commodi minus voluptate! Adipisci quis id corrupti dolore atque impedit porro facilis alias odio nesciunt. Distinctio enim blanditiis tempora, itaque nemo quaerat reiciendis! Sapiente necessitatibus quasi nostrum sequi ipsam cum ipsa culpa quas animi aut, nulla error quam voluptatem odio rerum doloremque eum exercitationem ducimus officiis, assumenda nam officia corporis! Nostrum tempora sequi aliquam cumque repudiandae corrupti laboriosam quam laudantium. Eius nulla ducimus commodi fuga sit nobis doloremque quibusdam ex, provident tempore odio. Ratione minus, reprehenderit maxime officiis sequi tempora autem nemo, qui vel, quia numquam. Quia ex aperiam, accusantium suscipit officiis eius assumenda animi ipsa vitae non enim quas ullam voluptatibus voluptatem dolorem illo, nobis vero laboriosam. Nesciunt, quidem. Reprehenderit voluptatum ad at repellendus, a assumenda amet architecto porro consequuntur magnam officiis. Consectetur vero ducimus neque fugit illum deleniti recusandae et ea assumenda, numquam atque magnam adipisci cumque praesentium. Suscipit autem voluptas, in consectetur aliquam nisi sapiente. Ipsam quis provident nostrum nihil beatae repudiandae id, dolorum amet maxime placeat. Eaque voluptas rerum doloremque saepe alias quaerat eveniet et nemo. Praesentium illo qui voluptatem sit deserunt ut ducimus, saepe quam quia doloribus tempora mollitia ad adipisci pariatur nesciunt ipsa excepturi amet odit omnis! Accusamus nam dolores voluptatum eius distinctio explicabo officiis, ut aut perspiciatis non accusantium voluptate beatae quia excepturi est, ex adipisci quae vero harum ipsam dignissimos? Laudantium modi magni, voluptas voluptatibus distinctio dolorem sunt asperiores esse eligendi quos. Et molestias earum officia inventore ipsum porro assumenda animi ipsa perferendis, modi possimus minus. A et ex accusamus, obcaecati, necessitatibus delectus dicta, error quod enim blanditiis labore commodi laborum vel illum odit modi amet sit eum nisi corporis animi! Unde repellendus veniam, inventore nostrum ea quas molestias aut iusto dolor dolorum. Explicabo est possimus repudiandae atque asperiores odio, nemo inventore? Temporibus, alias sit? Non a facilis, nisi voluptates ex blanditiis officia? Sed excepturi repellendus fuga debitis, alias quos blanditiis obcaecati nostrum pariatur omnis optio delectus suscipit? Similique placeat pariatur inventore laudantium cupiditate quod labore repudiandae, fugit veniam nisi, dolores quidem nam quos voluptatibus dolorem dolore hic odit voluptate reprehenderit amet reiciendis et eum delectus? Suscipit earum quisquam nesciunt enim, eum culpa voluptates possimus assumenda saepe reiciendis praesentium veniam laborum quibusdam? Repellat, dignissimos error eveniet voluptatum ut alias qui repudiandae atque ullam? Mollitia, rerum, sit atque ratione placeat deserunt facere saepe iure, omnis temporibus dignissimos. Non nemo deleniti minus odit voluptas tenetur eligendi laudantium natus delectus aliquam suscipit in, sit, voluptatum atque animi neque culpa sint accusamus? Ducimus nam totam exercitationem cum. Doloremque laborum sint quia natus ex consequatur perferendis enim tempora aliquam. Omnis eos nobis ipsam ab architecto esse, blanditiis officiis a ad fugit sit eum, quod fuga. Optio, tenetur? Consequatur aperiam fuga corporis pariatur mollitia. Quis, voluptate, possimus labore esse dolores nisi magni vel nulla consequatur voluptas eos alias ut ducimus non accusamus repellendus dolorem nihil ea sint obcaecati? Animi omnis voluptatum minus unde totam suscipit optio repudiandae provident voluptates beatae maxime, assumenda eaque rerum, ut perferendis, excepturi quod fugiat voluptatem illo facilis itaque impedit similique? Alias aliquam ipsum labore hic, error itaque minus commodi laborum voluptas. Dolorem odio modi incidunt necessitatibus voluptates nisi quia, libero aliquam sunt ullam dolor asperiores quos possimus molestias nostrum cum quibusdam accusamus? Earum, perspiciatis nobis quas voluptate similique consectetur cumque sunt atque inventore quidem commodi quaerat reprehenderit autem voluptatum? Vitae neque asperiores blanditiis nulla! Temporibus voluptatibus, eligendi omnis incidunt sapiente nemo praesentium atque deserunt eos nostrum explicabo, culpa inventore? Harum deleniti quaerat voluptates eaque, enim consectetur nulla doloribus autem? Repudiandae recusandae veritatis molestias placeat adipisci nemo vel corporis modi fuga corrupti consectetur ullam, quis fugit fugiat deleniti aperiam iste eligendi rerum temporibus quos laborum reiciendis exercitationem animi. Enim pariatur ad nam similique architecto asperiores, deserunt quas dolor quis officia vero odit unde impedit ex quisquam perspiciatis iste numquam non vitae eius officiis accusamus iure? Explicabo consequuntur, fuga est voluptatum ex error corporis ipsa optio, recusandae, deleniti accusamus minus? Ab quibusdam fuga rerum tempora facere possimus eveniet nemo, facilis exercitationem suscipit! Reiciendis, quisquam. Neque, eligendi cupiditate? Ut blanditiis dolor repellat quod veniam sapiente, pariatur fuga nostrum consectetur at eos, accusamus, aspernatur neque error omnis asperiores. Omnis voluptatem odio quam ipsa ullam iste atque placeat modi, ut inventore distinctio aperiam culpa corrupti, dolore voluptate autem quisquam quos totam provident labore. Mollitia soluta aspernatur voluptates repudiandae quo dolores inventore ipsam. Eos voluptas totam inventore, nostrum soluta dolorem nulla pariatur corrupti id porro, vitae numquam quia dignissimos excepturi enim consequuntur sit praesentium sint quidem reiciendis ad? Iste voluptatibus aliquam distinctio beatae ad vero aspernatur excepturi id consequuntur, nostrum pariatur itaque similique exercitationem tempora quibusdam officiis aut qui temporibus asperiores optio enim hic? Facere repudiandae, omnis minus velit eius eos quasi tenetur sit est dolorem, numquam ad voluptates nulla quae magni quibusdam! Corrupti, fuga et laborum animi repellendus ipsam distinctio doloremque! Quam veniam suscipit incidunt aperiam porro vero repellendus pariatur perferendis. Molestias optio dolores quas in voluptates officia alias at itaque libero sed adipisci blanditiis omnis eum, doloribus quisquam ab atque, aliquid, natus voluptatem earum dicta. Sint a sapiente rem cupiditate natus aliquam exercitationem quos hic necessitatibus quia alias dolorem neque, illum tempora nostrum earum. Et, amet perferendis, ducimus quaerat incidunt neque delectus alias cum nisi itaque pariatur ad qui, quae modi id obcaecati! Modi aspernatur excepturi asperiores quo ad, enim ipsa aliquam ratione culpa voluptatum? Voluptates quia eveniet fugit nemo et similique a perspiciatis atque maxime blanditiis fugiat soluta corrupti ea nihil voluptatum obcaecati ut sit iste aut vitae quaerat corporis dolorum, possimus provident. Beatae quam distinctio tempora hic ipsam deleniti error quidem provident harum voluptate? Eaque unde ipsa distinctio voluptates expedita minima numquam ex fugiat doloribus non alias, ab perspiciatis nisi, illo sed. Temporibus, nulla libero. Eveniet minima alias quae illo nesciunt beatae magnam ut vero, accusantium libero? Debitis ex unde nihil. Doloremque quaerat omnis blanditiis tempora iste illum vel nam aut repellendus? Aperiam, magnam non. Porro consectetur odio cum sequi aspernatur repellendus sed ipsa eum. Eius deserunt nam, nulla soluta hic id. Asperiores, incidunt. Error eligendi quidem maiores modi. Debitis commodi laudantium quia nihil obcaecati. Minima ad aut, omnis voluptatum harum ipsa rerum mollitia, expedita quo, illum eum optio tempore veritatis. Molestias, officiis! Quibusdam tenetur quaerat, quisquam vitae molestiae libero. Necessitatibus!
        </div>
        {/* <button className="arrow" onClick={prevCard}>{"<"}</button>
        <div className="forum-card">
          <h4>{forumData[index].title}</h4>
          <p>Instructor: {forumData[index].instructor}</p>
          <p>Email: {forumData[index].email}</p>
          <p>Semester: {forumData[index].semester}</p>
          <p>Fav: {forumData[index].fav}</p>
        </div> */}
        {/* <button className="arrow" onClick={nextCard}>{">"}</button> */}
      </div>

      <div className="course-section">
        <h3>Courses</h3>
        {/* <button className="arrow" onClick={prevCard}>{"<"}</button>
        <div className="course-card">
          <h4>{courseData[index].title}</h4>
          <p>Instructor: {courseData[index].instructor}</p>
          <p>Email: {courseData[index].email}</p>
          <p>Semester: {courseData[index].semester}</p>
          <p>Fav: {courseData[index].fav}</p>
          <button className="forum-button">ML Forum</button>
        </div>
        <button className="arrow" onClick={nextCard}>{">"}</button> */}
      </div>
    </div>
  );
};

export default Home;

