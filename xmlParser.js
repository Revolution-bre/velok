const parseXML = (xml) => {
    let stationData = [];
    const stationRegex = /<station>(.*?)<\/station>/g;
    const nstationRegex = /<nstation>(.*?)<\/nstation>/;
    const nomRegex = /<nom>(.*?)<\/nom>/;
    const latitudeRegex = /<latitude>(.*?)<\/latitude>/;
    const longitudeRegex = /<longitude>(.*?)<\/longitude>/;
    const activeRegex = /<active>(.*?)<\/active>/;
    const urlphotoRegex = /<urlphoto>(.*?)<\/urlphoto>/;
    const ebikesRegex = /<ebikes>(.*?)<\/ebikes>/;
    const libresRegex = /<libres>(.*?)<\/libres>/;
    const nomcommuneRegex = /<nomcommune>(.*?)<\/nomcommune>/; 
    // Add more regex patterns for other fields if needed



    let stationMatch = stationRegex.exec(xml);
    while (stationMatch) {
        const stationXML = stationMatch[1];
        const nstationMatch = stationXML.match(nstationRegex);
        const nomMatch = stationXML.match(nomRegex);
        const latitudeMatch = stationXML.match(latitudeRegex);
        const longitudeMatch = stationXML.match(longitudeRegex);
        const activeMatch = stationXML.match(activeRegex);
        const urlphotoMatch = stationXML.match(urlphotoRegex);
        const ebikesMatch = stationXML.match(ebikesRegex);
        const libresMatch = stationXML.match(libresRegex);
        const nomcommuneMatch = stationXML.match(nomcommuneRegex);
        // Extract other fields similarly

        const nstation = nstationMatch ? nstationMatch[1] : null;
        const nom = nomMatch ? nomMatch[1] : null;
        const latitude = latitudeMatch ? parseFloat(latitudeMatch[1]) : null;
        const longitude = longitudeMatch ? parseFloat(longitudeMatch[1]) : null;
        const active = activeMatch ? activeMatch[1] : null;
        const urlphoto = urlphotoMatch ? urlphotoMatch[1] : null;
        const ebikes = ebikesMatch ? ebikesMatch[1] : null;
        const libres = libresMatch ? libresMatch[1] : null;
        const nomcommune = nomcommuneMatch ? nomcommuneMatch[1] : null; 
        // Extract other fields similarly

        if (nstation && nom && !isNaN(latitude) && !isNaN(longitude)) {
            stationData.push({ nstation, nom, latitude, longitude, active, urlphoto, ebikes, libres, nomcommune   });
            // Add other fields to the push method
        }

        stationMatch = stationRegex.exec(xml);
    }

    return stationData;
};

export { parseXML };
