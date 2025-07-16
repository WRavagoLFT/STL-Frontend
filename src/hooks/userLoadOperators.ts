import { useOperatorFormStore } from "@/store/useOperatorFormStore";
import { fetchGameCategories } from "@/lib/api/gamecategories";
import { fetchAreaOfOperations, fetchCities, fetchProvinces, fetchRegions } from "@/lib/api/location";
import { fetchOperators } from "@/lib/api/operators/operators.service";

export const fetchOperatorsData = async () => {
  try {
    const { setData } = useOperatorFormStore.getState();
    const operators = await fetchOperators();
    setData(operators.data);
  } catch (error) {
    console.error("Error fetching operators:", error);
  }
};``

export const fetchFormOptionsData = async () => {
  try {
    const {
      setGameTypes,
      setRegions,
      setProvinces,
      setCities,
      setAreaOfOperations,
    } = useOperatorFormStore.getState();

    const gameTypesResponse = await fetchGameCategories();
    const regionsRes = await fetchRegions();
    const provincesRes = await fetchProvinces();
    const citiesRes = await fetchCities();
    const areaOpsRes = await fetchAreaOfOperations();

    setGameTypes(gameTypesResponse.data);
    setRegions(regionsRes.data);
    setProvinces(provincesRes.data);
    setCities(citiesRes.data);
    setAreaOfOperations(areaOpsRes.data);
  } catch (error) {
    console.error("Error fetching form options:", error);
  }
};
