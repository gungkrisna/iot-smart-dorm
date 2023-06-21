import { useState, useEffect } from "react";
import { retrieveAutomation } from "../store/auth";

const useAutomationData = (limit = Infinity) => {
  const [isFetching, setFetching] = useState(true);
  const [automationDocuments, setAutomationDocuments] = useState([]);

  const onUpdateAutomationDocuments = (documents) => {
    const slicedDocuments = documents.slice(0, limit);
    setAutomationDocuments(slicedDocuments);
    setFetching(false);
  };

  useEffect(() => {
    let unsubscribe = null;

    const fetchAutomationData = async () => {
      setFetching(true);
      unsubscribe = await retrieveAutomation(onUpdateAutomationDocuments);
      setFetching(false);
    };

    fetchAutomationData();

    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  return { isFetching, automationDocuments, onUpdateAutomationDocuments };
};

export default useAutomationData;
