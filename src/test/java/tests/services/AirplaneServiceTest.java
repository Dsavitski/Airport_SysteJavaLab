package tests.services;

import com.example.demo.dto.AirplaneCreateDto;
import com.example.demo.dto.AirplaneDisplayDto;
import com.example.demo.entities.Airplane;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.mapper.AirplaneMapper;
import com.example.demo.repository.AirplaneRepository;
import com.example.demo.service.AirplaneService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;

import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AirplaneServiceTest {

    @Mock
    private AirplaneRepository airplaneRepository;

    @Mock
    private AirplaneMapper airplaneMapper;

    @InjectMocks
    private AirplaneService airplaneService;

    private Airplane airplane;
    private AirplaneCreateDto createDto;
    private AirplaneDisplayDto displayDto;

    @BeforeEach
    void setUp() {
        airplane = new Airplane();
        airplane.setName("Boeing 737");
        airplane.setCapacity(180);

        createDto = new AirplaneCreateDto();
        createDto.setName("Boeing 737");
        createDto.setCapacity(180);

        displayDto = new AirplaneDisplayDto();
        displayDto.setName("Boeing 737");
        displayDto.setCapacity(180);
    }

    @Test
    void createAirplane_success() {
        when(airplaneMapper.toEntity(createDto)).thenReturn(airplane);
        when(airplaneRepository.save(airplane)).thenReturn(airplane);
        when(airplaneMapper.toDisplayDto(airplane)).thenReturn(displayDto);

        AirplaneDisplayDto result = airplaneService.createAirplane(createDto);

        assertNotNull(result);
        verify(airplaneRepository).save(airplane);
    }

    @Test
    void getAllAirplanes() {
        when(airplaneRepository.findAll()).thenReturn(List.of(airplane));
        when(airplaneMapper.toDisplayDto(airplane)).thenReturn(displayDto);

        List<AirplaneDisplayDto> result = airplaneService.getAllAirplanes();

        assertEquals(1, result.size());
    }

    @Test
    void getAirplaneById_success() {
        when(airplaneRepository.findById(1L)).thenReturn(Optional.of(airplane));
        when(airplaneMapper.toDisplayDto(airplane)).thenReturn(displayDto);

        AirplaneDisplayDto result = airplaneService.getAirplaneById(1L);

        assertNotNull(result);
    }

    @Test
    void getAirplaneById_notFound() {
        when(airplaneRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
            () -> airplaneService.getAirplaneById(1L));
    }

    @Test
    void updateAirplane_success() {
        AirplaneCreateDto updateDto = new AirplaneCreateDto();
        updateDto.setName("Airbus A320");
        updateDto.setCapacity(150);

        when(airplaneRepository.findById(1L)).thenReturn(Optional.of(airplane));
        when(airplaneRepository.save(any())).thenReturn(airplane);
        when(airplaneMapper.toDisplayDto(airplane)).thenReturn(displayDto);

        AirplaneDisplayDto result = airplaneService.updateAirplane(1L, updateDto);

        assertNotNull(result);
        assertEquals("Airbus A320", airplane.getName());
        assertEquals(150, airplane.getCapacity());
    }

    @Test
    void updateAirplane_notFound() {
        when(airplaneRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
            () -> airplaneService.updateAirplane(1L, createDto));
    }

    @Test
    void deleteAirplane_success() {
        when(airplaneRepository.existsById(1L)).thenReturn(true);

        airplaneService.deleteAirplane(1L);

        verify(airplaneRepository).deleteById(1L);
    }

    @Test
    void deleteAirplane_notFound() {
        when(airplaneRepository.existsById(1L)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class,
            () -> airplaneService.deleteAirplane(1L));
    }
}
