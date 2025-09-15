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
  const [socials, setSocials] = useState(null);

  const apiUrl = process.env.REACT_APP_BACKEND_SERVER;

  useEffect(() => {
    let intervalId;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/home/get-data`);

        setLogo(res.data.logo);
        setWelText(res.data.welText);
        setMSB(res.data.MSB);
        setMS(res.data.MS);
        setProf(res.data.Profile);
        setFO(res.data.FO);
        setEmailIcon(res.data.EmailIcon);
        setEmailT(res.data.EmailT);
        setPhoneIcon(res.data.PhoneI);
        setPhoneNumber(res.data.PhoneN);
        setAddressI(res.data.AddressI);
        setAddressT(res.data.AddressT);
        setSocials(res.data.socials);

        if (
          res.data.logo !== undefined &&
          res.data.welText !== undefined &&
          res.data.MSB !== undefined &&
          res.data.MS !== undefined &&
          res.data.Profile !== undefined &&
          res.data.FO !== undefined &&
          res.data.EmailIcon !== undefined &&
          res.data.EmailT !== undefined &&
          res.data.AddressI !== undefined &&
          res.data.AddressT !== undefined &&
          res.data.PhoneI !== undefined &&
          res.data.PhoneN !== undefined &&
          res.data.socials !== undefined
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
        fetchUser();
      }
    }, 5000);

    fetchUser();

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
      }}
    >
      {children}
    </MainDataContext.Provider>
  );
};
