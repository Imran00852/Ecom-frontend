import { useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";

const TossCoin = () => {
  const [angle, setAngle] = useState<number>(0);

  const flipCoin = () => {
    if (Math.random() > 0.5) setAngle((prev) => prev + 180);
    else setAngle((prev) => prev + 360);
  };
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard-app-container">
        <h1>Toss</h1>
        <section>
          <article
            className="toss-coin"
            onClick={flipCoin}
            style={{
              transform: `rotateY(${angle}deg)`,
              cursor: "pointer",
            }}
          >
            <div></div>
            <div></div>
          </article>
        </section>
      </main>
    </div>
  );
};

export default TossCoin;
