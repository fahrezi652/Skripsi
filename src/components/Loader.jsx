const Loader = (props = { root: false }) => {
    return (
        <div className="absolute top-0 left-0 right-0 bottom-0 z-[999999]">
            <div className={"flex items-center justify-center bg-white bg-opacity-70 " + (props.root ? ("h-screen") : ("h-full"))}>
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
            </div>
        </div>
    );
};

export default Loader;