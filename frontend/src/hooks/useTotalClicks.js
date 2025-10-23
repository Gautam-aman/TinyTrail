import { useState, useEffect, useCallback } from 'react';
import api from '../assets/api/BackendApiToken';

const getFormattedDate = (date) => date.toISOString().split('T')[0];

/** 
 
  @param {string} startDate
  @param {string} endDate 
 */
export function useTotalClicks(startDate, endDate) {
  
  const [totalClicks, setTotalClicks] = useState(null); 
  const [chartData, setChartData] = useState([]);       
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTotalClicks = useCallback(async () => {
    if (!startDate || !endDate) {
      setError("Dates are required for this query.");
      setIsLoading(false);
      return;
    }
      
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get('/api/urls/totalclicks', {
        params: {
          startDate: startDate, 
          endDate: endDate,
        }
      });
      
      const responseData = response.data;
      
      let newChartData = [];
      let grandTotal = 0;

      
      if (typeof responseData === 'object' && responseData !== null) {
          newChartData = Object.keys(responseData)
              .map(dateKey => {
                  const clickCount = Number(responseData[dateKey]);
                  grandTotal += clickCount;
                  return {
                      date: dateKey,
                      clicks: clickCount
                  };
              })
            
              .sort((a, b) => new Date(a.date) - new Date(b.date));
      } 
      
      setChartData(newChartData);
      setTotalClicks(grandTotal); 
      
    } catch (err) {
      console.error("Error fetching total clicks:", err); 
      
      const status = err.response ? err.response.status : 'N/A';
      const message = err.response 
        ? err.response.data.message || 'The server returned an unexpected error.'
        : 'Network Error.';
        
      setError(`Server Error (${status}): ${message}`);

    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]); 

  useEffect(() => {
    fetchTotalClicks();
  }, [fetchTotalClicks]); 

 
  return { totalClicks, chartData, isLoading, error, refetch: fetchTotalClicks };
}

export { getFormattedDate };