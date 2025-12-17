

const SectionHeader = ({heading, subHeading}) => {
    return (
        <div className="my-16 py-8">
            <h2 className="text-center font-bold text-4xl text-white leading-normal primary-color">--- {heading} ---</h2>
            <p className="font-semibold text-center text-white border-y-2 w-1/2 mx-auto py-4 secondary-color bd-primary-color">{subHeading}</p>
        </div>
    );
};

export default SectionHeader;