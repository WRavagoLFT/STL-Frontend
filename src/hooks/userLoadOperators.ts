import { useOperatorFormStore } from "~/store/useOperatorFormStore";
import { fetchGameCategories } from "~/utils/api/gamecategories";
import { fetchAreaOfOperations, fetchCities, fetchProvinces, fetchRegions } from "~/utils/api/location";
import { fetchOperators } from "~/utils/api/operators";

export const fetchFormOptionsData = async () => {
  try {
    const {
      setGameTypes,
      setRegions,
      setProvinces,
      setCities,
      setAreaOfOperations,
      setData,
    } = useOperatorFormStore.getState();

    const gameTypesResponse = await fetchGameCategories();
    const regionsRes = await fetchRegions();
    const provincesRes = await fetchProvinces();
    const citiesRes = await fetchCities({ availableOnly: true });
    const areaOpsRes = await fetchAreaOfOperations();
    const operators = await fetchOperators();

    setData(operators.data);
    setGameTypes(gameTypesResponse.data);
    setRegions(regionsRes.data);
    setProvinces(provincesRes.data);
    setCities(citiesRes.data);
    setAreaOfOperations(areaOpsRes.data);
  } catch (error) {
    console.error("Error fetching form options:", error);
  }
};