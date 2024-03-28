const parseBikeStatusXML = (xml) => {
    const statusRegex = /<status>(.*?)<\/status>/;

    const statusMatch = xml.match(statusRegex);
    const status = statusMatch ? parseInt(statusMatch[1], 10) : null;

    return status;
};

export { parseBikeStatusXML };
