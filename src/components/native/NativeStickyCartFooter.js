import KankregCartPayBar from "../kankreg/KankregCartPayBar";

/** @deprecated Use KankregCartPayBar */
export default function NativeStickyCartFooter(props) {
  return <KankregCartPayBar mode="sticky" {...props} />;
}
