import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
        paddingTop: 0,
    },
    header: {
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingBottom: 10, // Added this line to create space below the header
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        width: 16,
        height: 16,
        tintColor: '#333',
    },
    dashboardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },
    dashboardText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    contentContainer: {
        padding: 16,
        paddingTop: 8,
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: 0, // Removed space here
    },
    emblem: {
        width: 70,
        height: 70,
        marginBottom: 16,
    },
    titleText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 16,
        color: '#666',
    },
    mainCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 16, // Reduced from 24 to 16
    },
    contactUsTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    contactUsIcon: {
        width: 28,
        height: 28,
        marginRight: 12,
    },
    contactUsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    aboutUsContent: {
        marginBottom: 8,
    },
    aboutUsText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
        marginBottom: 16,
    },
    missionSection: {
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 8,
    },
    missionIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    missionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
    },
    missionText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    sectionIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F4F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionIcon: {
        width: 20,
        height: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#E8ECF0',
        marginVertical: 16,
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        columnGap: 20, // Add this line to create space between columns
    },
    contactColumn: {
        flex: 1,
        alignItems: 'flex-start',
    },
    contactText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 6,
    },
    socialSection: {
        alignItems: 'center',
    },
    socialIcons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    socialButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F0F4F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 12,
    },
    socialIcon: {
        width: 24,
        height: 24,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // paddingVertical: 24,
    },
    footerFlag: {
        width: 24,
        height: 16,
        marginRight: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#777',
        lineHeight: 20,
    },
});
