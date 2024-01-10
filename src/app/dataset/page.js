'use client';
import { Grid, Typography, FormControl, FormControlLabel, Radio, Box } from "@mui/material"
import RadioGroup from "@mui/material/RadioGroup";
import  "../../styles/Dataset.css";
import { useState } from "react";
import CustomButton from "../../components/common/Button";
import DatasetCardList from "./DatasetCardList";
import DatasetCard from "./DatasetCard";
import { useRouter } from "next/navigation";

export default function Dataset() {
    
    const [radiobutton, setRadiobutton] = useState(true);
    const router = useRouter();

    const handleProjectlist = () => {
        setRadiobutton(true);
    };
    const handleProjectcard = () => {
        setRadiobutton(false);
    };
    const handleCreateProject = (e) => {
        router.push(`/dataset/create-dataset/`);
    };
    const handleAutomateButton = (e) => {
        navigate("/datasets/automate");
    };

    const datasetList = [{
        "instance_id": 1,
        "instance_name": "English-Wikipedia-History-1",
        "dataset_type": "SentenceText"
    }, {
        "instance_id": 2,
        "instance_name": "English-Wikipedia-History-2",
        "dataset_type": "TranslationPair"
    }, {
        "instance_id": 3,
        "instance_name": "English-Wikipedia-History-3",
        "dataset_type": "SentenceText"
    }, {
        "instance_id": 4,
        "instance_name": "English-Wikipedia-History-4",
        "dataset_type": "TranslationPair"
    }, {
        "instance_id": 5,
        "instance_name": "English-Wikipedia-History-5",
        "dataset_type": "SentenceText"
    }, {
        "instance_id": 6,
        "instance_name": "English-Wikipedia-History-6",
        "dataset_type": "TranslationPair"
    }, {
        "instance_id": 7,
        "instance_name": "English-Wikipedia-History-7",
        "dataset_type": "SentenceText"
    }, {
        "instance_id": 8,
        "instance_name": "English-Wikipedia-History-8",
        "dataset_type": "TranslationPair"
    },]

    const [selectedFilters, setsSelectedFilters] = useState({
        dataset_visibility: "",
        dataset_type: "",
    });

    return (
        <>
            <Grid container className="root">
                <Grid item style={{ flexGrow: "0" }}>
                    <Typography variant="h6" sx={{ paddingBottom: "8px" }}>
                        View :{" "}
                    </Typography>
                </Grid>
                <Grid item style={{ flexGrow: "1", paddingLeft: "5px" }}>
                    <FormControl>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            defaultValue="DatasetList"
                        >
                            <FormControlLabel
                                value="DatasetList"
                                control={<Radio />}
                                label="List"
                                onClick={handleProjectlist}
                            />
                            <FormControlLabel
                                value="DatasetCard"
                                control={<Radio />}
                                label="Card"
                                onClick={handleProjectcard}
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
                <Grid xs={3} item className="fixedWidthContainer">
                    {/* <Search /> */}
                </Grid>
            </Grid>
            <Box>
                <CustomButton
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        mt: 2,
                        mb: 2,
                        justifyContent: "flex-end",
                    }}
                    onClick={handleCreateProject}
                    label="Create New Dataset Instance"
                />
                <CustomButton
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        mt: 2,
                        mb: 2,
                        ml: 2,
                        justifyContent: "flex-end",
                    }}
                    // disabled={userRole.Admin === loggedInUserData?.role ? false : true}
                    onClick={handleAutomateButton}
                    label="Automate Datasets"
                />
                <Box sx={{ p: 1 }}>
                    {radiobutton ? (
                        <DatasetCardList
                            datasetList={datasetList}
                            selectedFilters={selectedFilters}
                            setsSelectedFilters={setsSelectedFilters}
                        />
                    ) : (
                        <DatasetCard
                            datasetList={datasetList}
                            selectedFilters={selectedFilters}
                            setsSelectedFilters={setsSelectedFilters}
                        />
                    )}
                </Box>
            </Box>
        </>
    )
}