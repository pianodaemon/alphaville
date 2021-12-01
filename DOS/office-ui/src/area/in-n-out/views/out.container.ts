import { connect } from "react-redux";
import { Out } from "./out.componet";
import { outSelector } from "src/area/carriers/state/carriers.selectors";
import { loadCarriersAction } from "src/area/carriers/state/usecases/load-carriers.usecase";



const mapDispatchToProps = {
  loadCarriersAction,
};

function mapStateToProps(state: any) {
  return {
    carriers: outSelector(state),
  };
}

export const OutContainer = connect(mapStateToProps, mapDispatchToProps)(Out);
