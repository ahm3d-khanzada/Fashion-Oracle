import { motion } from "framer-motion";

const Recommendation_Loader = () => {
  return (
    <motion.div
      className="d-flex justify-content-center my-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="spinner-border text-light"
        role="status"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <span className="visually-hidden">Loading...</span>
      </motion.div>
    </motion.div>
  );
};

export default Recommendation_Loader;