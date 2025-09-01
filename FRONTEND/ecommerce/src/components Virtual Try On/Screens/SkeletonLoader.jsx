import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const SkeletonLoader = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Skeleton height={40} width={200} style={styles.title} />
      </div>
      <div style={styles.content}>
        <div style={styles.imageContainer}>
          <Skeleton height={400} style={styles.image} />
        </div>
        <div style={styles.detailsContainer}>
          <Skeleton count={1} height={30} width="60%" style={styles.detail} />
          <Skeleton count={3} height={20} style={styles.detail} />
        </div>
      </div>
      <div style={styles.footer}>
        <Skeleton height={50} width={200} style={styles.button} />
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "15px",
    marginBottom: "20px",
  },
  header: {
    marginBottom: "20px",
  },
  title: {
    borderRadius: "8px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  imageContainer: {
    marginBottom: "20px",
  },
  image: {
    borderRadius: "10px",
  },
  detailsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  detail: {
    borderRadius: "4px",
  },
  footer: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
  },
  button: {
    borderRadius: "25px",
  },
}

export default SkeletonLoader

