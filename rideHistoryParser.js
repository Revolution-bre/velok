const parseRideHistoryXML = (xml) => {
    let rideHistoryData = [];
    const historiqueRegex = /<historique>(.*?)<\/historique>/g;
    const datedebutRegex = /<datedebut>(.*?)<\/datedebut>/;
    const datefinRegex = /<datefin>(.*?)<\/datefin>/;
    const dureeRegex = /<duree>(.*?)<\/duree>/;
    const veloRegex = /<velo>(.*?)<\/velo>/;
    const stationdebutRegex = /<stationdebut>(.*?)<\/stationdebut>/;
    const communedebutRegex = /<communedebut>(.*?)<\/communedebut>/;
    const stationfinRegex = /<stationfin>(.*?)<\/stationfin>/;
    const communefinRegex = /<communefin>(.*?)<\/communefin>/;
    // Add more regex patterns for other fields if needed
  
    let historiqueMatch = historiqueRegex.exec(xml);
    while (historiqueMatch) {
      const historiqueXML = historiqueMatch[1];
      const datedebutMatch = historiqueXML.match(datedebutRegex);
      const datefinMatch = historiqueXML.match(datefinRegex);
      const dureeMatch = historiqueXML.match(dureeRegex);
      const veloMatch = historiqueXML.match(veloRegex);
      const stationdebutMatch = historiqueXML.match(stationdebutRegex);
      const communedebutMatch = historiqueXML.match(communedebutRegex);
      const stationfinMatch = historiqueXML.match(stationfinRegex);
      const communefinMatch = historiqueXML.match(communefinRegex);

  
      const datedebut = datedebutMatch ? datedebutMatch[1] : null;
      const datefin = datefinMatch ? datefinMatch[1] : null;
      const duree = dureeMatch ? dureeMatch[1] : null;
      const velo = veloMatch ? veloMatch[1] : null;
      const stationdebut = stationdebutMatch ? stationdebutMatch[1] : null;
      const communedebut = communedebutMatch ? communedebutMatch[1] : null;
      const stationfin = stationfinMatch ? stationfinMatch[1] : null;
      const communefin = communefinMatch ? communefinMatch[1] : null;

  
      rideHistoryData.push({ datedebut, datefin, duree, velo, stationdebut, communedebut, stationfin, communefin });
      // Add other fields to the push method
  
      historiqueMatch = historiqueRegex.exec(xml);
    }
  
    return rideHistoryData;
  };
  
  export { parseRideHistoryXML };
  