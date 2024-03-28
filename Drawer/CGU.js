import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const decodeSpecialCharacters = (text) => {
  // Replace the problematic character with its correct representation
  // You may need to adjust the Unicode code point to match your specific character if it's not ''
  return text.replace(/\uF0B7/g, '•'); // Assuming '•' is the desired character
};

const parseCGUXML = (xml) => {
  let articlesData = [];
  const articleRegex = /<article>(.*?)<\/article>/gs;
  const narticleRegex = /<narticle>(.*?)<\/narticle>/;
  const titreRegex = /<Titre>(.*?)<\/Titre>/;
  const texteRegex = /<Texte><!\[CDATA\[(.*?)\]\]><\/Texte>/s;

  let articleMatch = articleRegex.exec(xml);
  while (articleMatch) {
    const articleXML = articleMatch[1];
    const narticleMatch = articleXML.match(narticleRegex);
    const titreMatch = articleXML.match(titreRegex);
    const texteMatch = articleXML.match(texteRegex);

    const narticle = narticleMatch ? narticleMatch[1] : null;
    const titre = titreMatch ? titreMatch[1] : null;
    const texte = texteMatch ? decodeSpecialCharacters(texteMatch[1].trim()) : null;  // Decode special characters

    if (narticle && titre && texte) {
      articlesData.push({ narticle, titre, texte });
    }

    articleMatch = articleRegex.exec(xml);
  }

  return articlesData;
};

const CGUDrawer = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('https://webservice.velok.lu/cgu.aspx')
      .then(response => response.text())
      .then(xml => {
        const data = parseCGUXML(xml);
        setArticles(data);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <ScrollView style={styles.container}>
      {articles.map((article, index) => (
        <View key={index} style={styles.articleContainer}>
          <Text style={styles.articleTitle}>{`Article ${article.narticle}: ${article.titre}`}</Text>
          <Text style={styles.articleText}>{article.texte}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default CGUDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  articleContainer: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  articleTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  articleText: {
    fontSize: 14,
  },
});
