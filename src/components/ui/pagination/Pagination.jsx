// Pagination.js
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const Pagination = ({currentPage, itemsPerPage, totalItems, onPageChange}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <View style={styles.paginationContainer}>
      <Text style={styles.paginationText}>
        {(currentPage - 1) * itemsPerPage + 1} -
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
      </Text>
      <View style={styles.paginationButtons}>
        <TouchableOpacity
          onPress={goToPreviousPage}
          disabled={currentPage === 1}
          style={currentPage === 1 ? styles.disabledButton : null}>
          <Text
            style={[
              styles.paginationArrow,
              currentPage === 1 ? styles.disabledText : null,
            ]}>
            ◀
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goToNextPage}
          disabled={currentPage === totalPages}
          style={currentPage === totalPages ? styles.disabledButton : null}>
          <Text
            style={[
              styles.paginationArrow,
              currentPage === totalPages ? styles.disabledText : null,
            ]}>
            ▶
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 20,
  },
  paginationText: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  paginationButtons: {
    flexDirection: 'row',
  },
  paginationArrow: {
    fontSize: 16,
    color: '#10B981',
    paddingHorizontal: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#ccc',
  },
});

export default Pagination;
