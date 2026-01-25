import { Calendar, ChevronDown } from "lucide-react-native";
import moment from "moment";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AuthApi from "../../../components/AuthApi";

const CustomSelect = ({
  data,
  uniqId,
  setSched,
  setId,
  setSpot,
  setSpotFilled,
  setSpotCount,
  setSchedDate,
}) => {
  const [dataSource, setDataSource] = React.useState([]);
  const [start, setStart] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const [eventData, setEventData] = React.useState(null);

  const Auth = React.useContext(AuthApi);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(`https://hostnplay.com/api/game-event-dates?id=${uniqId}&start=0`)
      .then((res) => res.json())
      .then((resJSON) => {
        if (!resJSON || resJSON.length === 0) return;

        setDataSource(resJSON);
        setStart(1);
        setSched(resJSON[0].EventDate);
        setId(resJSON[0].Id);
        setSpot(resJSON[0].SpotsAvailable);
        setSpotFilled(resJSON[0].Spots);
        setSpotCount(resJSON[0].SpotCount);
        setEventData(resJSON[0]);

        const result = moment(resJSON[0].EventDate).subtract(1, "day").unix();
        setSchedDate(result);
      });
  };

  const fetchDataScroll = () => {
    fetch(
      `https://hostnplay.com/api/game-event-dates?id=${uniqId}&start=${start}`,
    )
      .then((res) => res.json())
      .then((resJSON) => {
        if (!resJSON || resJSON.length === 0) return;
        setDataSource([...dataSource, ...resJSON]);
        setStart(start + 1);
      });
  };

  const handleSelect = (item) => {
    setSched(item.EventDate);
    setId(item.Id);
    setSpot(item.SpotsAvailable);
    setSpotFilled(item.Spots);
    setSpotCount(item.SpotCount);
    setEventData(item);
    setIsOpen(false);

    const result = moment(item.EventDate).subtract(1, "day").unix();
    setSchedDate(result);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.option,
        {
          backgroundColor: "#d3d3d3",
        },
      ]}
      onPress={() => handleSelect(item)}
    >
      <Calendar size={20} color={"black"} />
      <Text style={[styles.optionText, { color: "black" }]}>
        {item.Spots} {item.EventDate}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ width: "100%", position: "relative", zIndex: 5 }}>
      <TouchableOpacity
        style={[styles.select, { backgroundColor: "#d3d3d3" }]}
        onPress={() => setIsOpen(!isOpen)}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Calendar size={24} color={"black"} />
          <Text style={{ color: "black" }}>
            {eventData
              ? `${eventData.Spots} ${eventData.EventDate}`
              : "Select Date"}
          </Text>
        </View>
        <ChevronDown size={24} color={"black"} />
      </TouchableOpacity>

      {isOpen && dataSource.length > 0 && (
        <View
          style={[
            styles.dropdown,
            {
              maxHeight: 200,
              backgroundColor: "#d3d3d3",
            },
          ]}
        >
          <FlatList
            data={dataSource}
            keyExtractor={(item) => item.Id.toString()}
            renderItem={renderItem}
            onEndReached={fetchDataScroll}
            onEndReachedThreshold={0.5}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  select: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    cursor: "pointer",
  },
  dropdown: {
    borderRadius: 5,
    width: "100%",
    padding: 5,
    position: "absolute",
    top: 50,
    zIndex: 5,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 5,
    gap: 5,
  },
  optionText: {
    fontSize: 14,
  },
});

export default CustomSelect;
