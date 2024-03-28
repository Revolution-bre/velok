import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, ScrollView } from 'react-native';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ContactDrawer = () => {
    const [collapsibleSections, setCollapsibleSections] = useState(Array(6).fill(false));
  
    const toggleSection = (index) => {
      const newCollapsibleSections = [...collapsibleSections];
      newCollapsibleSections[index] = !newCollapsibleSections[index];
      setCollapsibleSections(newCollapsibleSections);
    };

  const sections = [
    {
      title: 'Enfance et Jeunesse',
      links: [
        { name: 'Crèche Belval', url: 'https://heemelmaus.lu/qui-sommes-nous-creche-belval/' },
        { name: 'Accueil Educatif', url: 'https://heemelmaus.lu/qui-sommes-nous-accueil-educatif/' },
        { name: 'Maison Relais', url: 'https://heemelmaus.lu/qui-sommes-nous-maison-relais/' },
      ],
    },
    {
      title: 'Mobilité',
      links: [{ name: 'Vël\'Ok', url: 'https://velok.lu' }],
    },
    {
      title: 'Nature, création et citoyenneté',
      links: [
        { name: 'Den Escher Geméisguart', url: 'https://www.ciglesch.lu/deg/' },
        { name: 'Kalendula', url: 'https://www.ciglesch.lu/kal/' },
        { name: 'Léieren am gaart', url: 'https://www.ciglesch.lu/lag/' },
        { name: 'Kreavert', url: 'https://www.ciglesch.lu/services/#kv' },
        { name: 'RECUP', url: 'https://www.ciglesch.lu/recup/' },
      ],
    },
    {
      title: 'Service de proximité',
      links: [
        { name: 'SERVICE À LA PERSONNE', url: 'https://www.ciglesch.lu/servicealapersonne/' },
        { name: 'Den Handkesselchen', url: 'https://www.ciglesch.lu/den-handkesselchen/' },
      ],
    },
    {
      title: 'Tourisme',
      links: [
        { name: 'Brasserie Camping’s Stuff', url: 'https://www.ciglesch.lu/brasseriecampingsstuff/' },
        { name: 'Maison Rosati', url: 'https://www.ciglesch.lu/maisonrosati/' },
      ],
    },
    {
      title: 'Aménagement et construction',
      links: [
        { name: 'entretien des espaces verts', url: 'https://www.ciglesch.lu/entretiendesespacesverts/' },
        { name: 'La construction durable', url: 'https://www.ciglesch.lu/constructionsdurables/' },
      ],
    },
  ];

  return (
<ScrollView style={styles.scrollView}>
  <View style={styles.container}>
    <Image source={{ uri: 'https://www.ciglesch.lu/wp-content/uploads/2019/03/logo-webiste-320-135-2.png' }} style={styles.image} />
    <Text style={styles.title}>Centre d’Initiative et de Gestion Local (CIGL) d’Esch-sur-Alzette</Text>

    <View style={styles.contactContainer}>
      <View style={styles.contactBox}>
        <TouchableOpacity onPress={() => Linking.openURL('tel:00352544245203')} style={styles.contactItem}>
          <Icon name="phone" size={24} color="#000" />
          <Text>Appeler</Text>
        </TouchableOpacity> 
      </View>
      <View style={styles.contactBox}>
        <TouchableOpacity onPress={() => Linking.openURL('mailto:info@velok.lu')} style={styles.contactItem}>
          <Icon name="email" size={24} color="#000" />
          <Text>E-mail</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contactBox}>
        <TouchableOpacity onPress={() => Linking.openURL('https://www.velok.lu')} style={styles.contactItem}>
          <Icon name="computer" size={24} color="#000" />
          <Text>Website</Text>
        </TouchableOpacity>
      </View>
    </View>

    <TouchableOpacity onPress={() => Linking.openURL('http://maps.apple.com/?address=52,RueLouisPasteur,L-4276,Esch-sur-Alzette')} style={styles.addressContainer}>
      <Icon name="location-on" size={20} color="#000" />
      <Text style={styles.link}>52 Rue Louis Pasteur, L-4276 Esch-sur-Alzette</Text>
    </TouchableOpacity>

    <Text style={styles.description}>
      Le Centre d’Initiative et de Gestion Local (CIGL) d’Esch-sur-Alzette est une association sans but lucratif d’économie solidaire née en 1997.
      L’association poursuit deux grands objectifs. Le premier est d’aider des personnes sans emploi à retrouver un travail et à se réinsérer dans la vie sociale. Le second est de développer des services qui répondent à des besoins non satisfaits de la population.
    </Text>

    <Text style={styles.servicesTitle}>Services</Text>
    {sections.map((section, index) => (
      <View key={index} style={styles.sectionContainer}>
        <TouchableOpacity onPress={() => toggleSection(index)} style={styles.collapsibleHeader}>
          <Icon name={collapsibleSections[index] ? "keyboard-arrow-down" : "keyboard-arrow-right"} size={20} color="#000" />
          <Text style={styles.collapsibleTitle}>{section.title}</Text>
        </TouchableOpacity>
        <Collapsible collapsed={collapsibleSections[index]} style={styles.collapsibleContent}>
          {section.links.map((link, linkIndex) => (
            <TouchableOpacity key={linkIndex} onPress={() => Linking.openURL(link.url)} style={styles.collapsibleItem}>
              <Text>{link.name}</Text>
            </TouchableOpacity>
          ))}
        </Collapsible>
      </View>
    ))}
  </View>
</ScrollView>

  );
};

export default ContactDrawer;


const styles = StyleSheet.create({
    scrollView: {
      flex: 1,
      backgroundColor: '#faebd7',
    },
    container: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 20,
      paddingBottom: 20,
    },
    image: {
      width: 160,
      height: 70,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 10,
      textAlign: 'center',
      paddingHorizontal: 10,
    },
    addressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
      marginVertical: 15,
    },
    link: {
      color: 'blue',
      textDecorationLine: 'underline',
      marginLeft: 5,
    },
    contactContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginTop: 10,
    },
    contactBox: {
      backgroundColor: '#f2f2f2',
      borderRadius: 10,
      padding: 10,
      marginHorizontal: 5,
      marginVertical: 20,
      backgroundColor: '#cd853f',
    },
    contactItem: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    description: {
      textAlign: 'center',
      padding: 10,
      marginVertical: '20'
    },
    servicesTitle: {
      fontWeight: 'bold',
      fontSize: 20,
      marginTop: 10,
      marginVertical: 20,
    },
    sectionContainer: {
      alignItems: 'flex-start',
      width: '100%',
      paddingHorizontal: 20,
    },
    collapsibleHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'orange',
      borderRadius: 5,
      padding: 10,
      marginTop: 10,
    },
    collapsibleTitle: {
      fontWeight: 'bold',
      marginLeft: 10,
    },
    collapsibleContent: {
      width: '100%',
    },
    collapsibleItem: {
      backgroundColor: '#fff',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#e8e8e8',
    },
  });