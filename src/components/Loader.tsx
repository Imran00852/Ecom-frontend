const Loader = () => {
  return (
    <section className="loader">
      <div></div>
    </section>
  );
};

export default Loader;

export const Skeleton = ({
  width = "unset",
  length = 3,
  height = "30px",
  containerHeight = "unset",
}: {
  width?: string;
  length?: number;
  height?: string;
  containerHeight?: string;
}) => {
  const skeletons = Array.from({ length }, (_, idx) => (
    <div key={idx} className="skeleton-shape" style={{ height }}></div>
  ));

  return (
    <div className="skeleton-loader" style={{ width, height: containerHeight }}>
      {skeletons}
    </div>
  );
};
