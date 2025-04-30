import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F1F1',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: '#F1F1F1',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    backButton: {
        padding: 8,
        marginRight: 10, // Reduced from 24 to 10 to bring text closer to icon
    },
    backIcon: {
        width: 24,
        height: 24,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
    flagContainer: {
        height: 100,
        backgroundColor: '#4A6EB5', // Fallback color
        overflow: 'hidden',
    },
    flagImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    contentCard: {
        backgroundColor: 'white',
        borderRadius: 30,
        marginTop: -25,
        marginHorizontal: 0,
        flex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    contentWrapper: {
        paddingLeft: 40, // Added padding from the left
        paddingRight: 24,
        paddingTop: 30,
        paddingBottom: 40,
    },
    contentTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 12,
    },
    contentText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#000000',
        marginBottom: 20,
    },
});
