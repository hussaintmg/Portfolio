import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const MainDataContext = createContext();

export const MainDataProvider = ({ children }) => {
  const [logo, setLogo] = useState(null);
  const [Prof, setProf] = useState(null);
  const [welText, setWelText] = useState(null);
  const [MSB, setMSB] = useState(null);
  const [MS, setMS] = useState(null);
  const [FO, setFO] = useState(null);
  const [EmailIcon, setEmailIcon] = useState(null);
  const [EmailT, setEmailT] = useState(null);
  const [AddressT, setAddressT] = useState(null);
  const [AddressI, setAddressI] = useState(null);
  const [PhoneIcon, setPhoneIcon] = useState(null);
  const [PhoneNumber, setPhoneNumber] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [socials, setSocials] = useState([]);
  const [skIcons, setSkIcons] = useState([]);
  const [skList, setSkList] = useState([]);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);

  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

  const fetchProjects = async () => {
    try {
      const resProjects = await axios.get(`${apiUrl}/api/projects/get-data`);
      setProjects(resProjects.data.projects);
    } catch (err) {
      console.log("Projects fetch error: ", err);
    }
  };

  useEffect(() => {
    let intervalId;
    const fetchData = async () => {
      try {
        await fetchProjects();

        const resHome = await axios.get(`${apiUrl}/api/home/get-data`);

        setLogo(resHome.data.logo);
        setProf(resHome.data.Profile);
        setWelText(resHome.data.welText);
        setMSB(resHome.data.MSB);
        setMS(resHome.data.MS);
        setFO(resHome.data.FO);
        setEmailIcon(resHome.data.EmailIcon);
        setEmailT(resHome.data.EmailT);
        setPhoneIcon(resHome.data.PhoneI);
        setPhoneNumber(resHome.data.PhoneN);
        setAddressI(resHome.data.AddressI);
        setAddressT(resHome.data.AddressT);
        setSocials(resHome.data.socials);

        const resSkills = await axios.get(`${apiUrl}/api/skill/get-data`);
        setSkIcons(resSkills.data.icons);
        setSkList(resSkills.data.skList);
        setServices(resSkills.data.services);
        if (
          resHome.data.logo !== undefined &&
          resHome.data.welText !== undefined &&
          resHome.data.MSB !== undefined &&
          resHome.data.MS !== undefined &&
          resHome.data.Profile !== undefined &&
          resHome.data.FO !== undefined &&
          resHome.data.EmailIcon !== undefined &&
          resHome.data.EmailT !== undefined &&
          resHome.data.AddressI !== undefined &&
          resHome.data.AddressT !== undefined &&
          resHome.data.PhoneI !== undefined &&
          resHome.data.PhoneN !== undefined &&
          resHome.data.socials !== undefined &&
          resSkills.data.icons !== undefined &&
          resSkills.data.skList !== undefined &&
          resSkills.data.services !== undefined
        ) {
          setDataLoaded(true);
          clearInterval(intervalId);
        }
      } catch (err) {
        console.log("Main Data Error: ", err);
      }
    };

    intervalId = setInterval(() => {
      if (!dataLoaded) {
        fetchData();
      }
    }, 5000);

    fetchData();

    return () => clearInterval(intervalId);
  }, [apiUrl, dataLoaded]);

  return (
    <MainDataContext.Provider
      value={{
        logo,
        welText,
        MSB,
        MS,
        Prof,
        FO,
        dataLoaded,
        EmailIcon,
        EmailT,
        PhoneIcon,
        PhoneNumber,
        AddressI,
        AddressT,
        socials,
        skIcons,
        skList,
        services,
        projects,
        fetchProjects,
      }}
    >
      {children}
    </MainDataContext.Provider>
  );
};
